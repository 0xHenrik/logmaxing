import type { Handle } from '@sveltejs/kit';

import { env } from '$env/dynamic/private';
import { sequence } from '@sveltejs/kit/hooks';

import { type ValidatedApiKey, validateApiKey } from '$lib/server/api/apiKeys';
import { type RateLimitTier, checkRateLimit, getRateLimitHeaders } from '$lib/server/ratelimit';

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

	// CSP — Scalar loads in an iframe (static/scalar.html) so the main app CSP stays strict
	const csp = [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline'",
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data:",
		"font-src 'self'",
		"connect-src 'self'",
		"frame-src 'self'",
		"frame-ancestors 'none'",
		"base-uri 'self'",
		"form-action 'self'"
	].join('; ');

	headers.set('Content-Security-Policy', csp);

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
};

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
	const clientIp = event.getClientAddress();

	let validatedKey: ValidatedApiKey | null = null;
	let tier: RateLimitTier = 'free';

	// Rate-limit authentication attempts per IP to prevent brute force
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

	// Require API key for all endpoints
	if (!apiKeyHeader) {
		return new Response(
			JSON.stringify({
				error: 'Unauthorized',
				message: 'API key required. Include X-API-Key header in your request.'
			}),
			{
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}

	// Validate the API key
	validatedKey = await validateApiKey(apiKeyHeader);

	if (!validatedKey) {
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

	// Use key ID for rate limiting (more accurate than raw key)
	const identifier = `key:${validatedKey.id}`;
	tier = validatedKey.tier;

	// Attach to locals for route handlers
	event.locals.apiKey = validatedKey;

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

// Security headers run first (outermost), then API auth
export const handle = sequence(securityHeaders, apiAuth);
