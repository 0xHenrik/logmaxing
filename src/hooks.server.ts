import type { Handle } from '@sveltejs/kit';
import type { User, Session } from '@supabase/supabase-js';

import { env } from '$env/dynamic/private';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';

import { getUserProfileBySupabaseId } from '$lib/server/api/userProfile';
import { createSupabaseServerClient } from '$lib/server/auth/supabase-server';
import { type ValidatedApiKey, validateApiKey } from '$lib/server/api/apiKeys';
import { type RateLimitTier, checkRateLimit, getRateLimitHeaders } from '$lib/server/ratelimit';

// ── Supabase Auth Hook ──────────────────────────────────────────────
// Creates per-request Supabase client and session accessor.
// Must run before apiAuth so event.locals.supabase is available.
const supabaseAuth: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient(event.cookies);

	event.locals.safeGetSession = async (): Promise<{
		session: Session | null;
		user: User | null;
	}> => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error || !user) {
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

// ── Security Headers Hook ───────────────────────────────────────────
const securityHeaders: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	const headers = new Headers(response.headers);

	// HSTS — enforce HTTPS for 1 year, include subdomains
	headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

	// Prevent clickjacking (frame-ancestors in CSP is primary, this is fallback for older browsers)
	headers.set('X-Frame-Options', 'DENY');

	// Prevent MIME-type sniffing
	headers.set('X-Content-Type-Options', 'nosniff');

	// Control referrer information
	headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

	// Isolate browsing context — mitigate cross-origin attacks
	headers.set('Cross-Origin-Opener-Policy', 'same-origin');

	// Restrict browser features we don't use
	headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

	// CSP — allow Supabase and OAuth provider domains
	const supabaseDomain = new URL(PUBLIC_SUPABASE_URL).hostname;
	const csp = [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline'",
		"style-src 'self' 'unsafe-inline'",
		`img-src 'self' data: https://lh3.googleusercontent.com https://*.googleusercontent.com`,
		"font-src 'self'",
		`connect-src 'self' https://${supabaseDomain}`,
		"frame-src 'self'",
		"frame-ancestors 'none'",
		"base-uri 'self'",
		"form-action 'self' https://accounts.google.com https://appleid.apple.com"
	].join('; ');

	headers.set('Content-Security-Policy', csp);

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
};

// ── API Auth Hook ───────────────────────────────────────────────────
// Supports both X-API-Key (machine clients) and Bearer token (user clients).
const apiAuth: Handle = async ({ event, resolve }) => {
	const apiHost = env.API_HOST || 'api.logmaxing.tech';
	const isApiSubdomain = event.url.host === apiHost;
	const pathname = event.url.pathname;

	// Determine if this request needs API auth:
	// - Direct /api/* routes on the main domain
	// - All routes on api.logmaxing.tech (reroute hook prepends /api/)
	const isApiRoute = pathname.startsWith('/api/') || isApiSubdomain;

	// Public endpoints that skip auth
	const isPublic =
		pathname.includes('openapi.json') ||
		pathname.startsWith('/api/waitlist') ||
		(isApiSubdomain && pathname === '/waitlist');

	if (!isApiRoute || isPublic) {
		return resolve(event);
	}

	const apiKeyHeader = event.request.headers.get('X-API-Key');
	const authHeader = event.request.headers.get('Authorization');
	const clientIp = event.getClientAddress();

	let validatedKey: ValidatedApiKey | null = null;
	let tier: RateLimitTier = 'free';

	// Helper: check brute-force rate limit on failed auth (per IP)
	async function checkAuthAttemptLimit() {
		const authRl = await checkRateLimit(`auth_attempt:${clientIp}`, 'auth_attempt');
		if (!authRl.success) {
			return new Response(
				JSON.stringify({
					error: 'Too Many Requests',
					message: 'Too many authentication attempts. Please try again later.',
					retryAfter: Math.ceil((authRl.reset - Date.now()) / 1000)
				}),
				{
					status: 429,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}
		return null;
	}

	// Strategy 1: API Key authentication (existing behavior)
	if (apiKeyHeader) {
		validatedKey = await validateApiKey(apiKeyHeader);

		if (!validatedKey) {
			// Count failed attempt against brute-force limit
			const blocked = await checkAuthAttemptLimit();
			if (blocked) return blocked;

			return new Response(
				JSON.stringify({
					error: 'Unauthorized',
					message: 'Invalid or revoked API key'
				}),
				{
					status: 401,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		event.locals.apiKey = validatedKey;
		tier = validatedKey.tier;
	}
	// Strategy 2: Supabase JWT Bearer token
	else if (authHeader?.startsWith('Bearer ')) {
		const token = authHeader.slice(7);

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser(token);

		if (error || !user) {
			// Count failed attempt against brute-force limit
			const blocked = await checkAuthAttemptLimit();
			if (blocked) return blocked;

			return new Response(
				JSON.stringify({
					error: 'Unauthorized',
					message: 'Invalid or expired Bearer token'
				}),
				{
					status: 401,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		const profile = await getUserProfileBySupabaseId(user.id);
		if (!profile) {
			return new Response(
				JSON.stringify({
					error: 'Forbidden',
					message: 'No user profile found. Complete registration first.'
				}),
				{
					status: 403,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		event.locals.user = user;
		event.locals.userProfile = profile;
	}
	// No authentication provided
	else {
		// Count missing-auth attempt against brute-force limit
		const blocked = await checkAuthAttemptLimit();
		if (blocked) return blocked;

		return new Response(
			JSON.stringify({
				error: 'Unauthorized',
				message: 'API key or Bearer token required.'
			}),
			{
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}

	// Rate limit identifier based on auth method
	const identifier = validatedKey
		? `key:${validatedKey.id}`
		: `user:${event.locals.userProfile!.id}`;

	// Check rate limit based on tier
	const result = await checkRateLimit(identifier, tier);
	const rateLimitHeaders = getRateLimitHeaders(result);

	if (!result.success) {
		return new Response(
			JSON.stringify({
				error: 'Too Many Requests',
				message: 'Rate limit exceeded. Please try again later.',
				retryAfter: Math.ceil((result.reset - Date.now()) / 1000)
			}),
			{
				status: 429,
				headers: {
					'Content-Type': 'application/json',
					...rateLimitHeaders
				}
			}
		);
	}

	// Add rate limit headers to successful responses
	const response = await resolve(event);
	const newHeaders = new Headers(response.headers);
	Object.entries(rateLimitHeaders).forEach(([key, value]) => {
		newHeaders.set(key, value);
	});

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: newHeaders
	});
};

// Supabase auth first (populates locals.supabase), then security headers, then API auth
export const handle = sequence(supabaseAuth, securityHeaders, apiAuth);
