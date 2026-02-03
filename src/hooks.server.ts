import type { Handle } from '@sveltejs/kit';

import { type ValidatedApiKey, validateApiKey } from '$lib/server/api/apiKeys';
import { type RateLimitTier, checkRateLimit, getRateLimitHeaders } from '$lib/server/ratelimit';

export const handle: Handle = async ({ event, resolve }) => {
	// Only process API routes (except openapi.json which is docs)
	if (event.url.pathname.startsWith('/api/') && !event.url.pathname.includes('openapi.json')) {
		const apiKeyHeader = event.request.headers.get('X-API-Key');

		let validatedKey: ValidatedApiKey | null = null;
		let tier: RateLimitTier = 'free';

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
		const headers = getRateLimitHeaders(result);

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
						...headers
					}
				}
			);
		}

		// Add rate limit headers to successful responses
		const response = await resolve(event);

		// Clone response to add headers
		const newHeaders = new Headers(response.headers);
		Object.entries(headers).forEach(([key, value]) => {
			newHeaders.set(key, value);
		});

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: newHeaders
		});
	}

	return resolve(event);
};
