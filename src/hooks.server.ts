import type { Handle } from '@sveltejs/kit';

import { checkRateLimit, getRateLimitHeaders } from '$lib/server/ratelimit';

export const handle: Handle = async ({ event, resolve }) => {
	// Only rate limit API routes (except openapi.json which is docs)
	if (event.url.pathname.startsWith('/api/') && !event.url.pathname.includes('openapi.json')) {
		// Get identifier: API key header, or IP address
		const apiKey = event.request.headers.get('X-API-Key');
		const ip = event.getClientAddress();
		const identifier = apiKey || `ip:${ip}`;

		const result = await checkRateLimit(identifier);
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
