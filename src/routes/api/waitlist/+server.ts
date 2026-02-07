import type { RequestHandler } from '@sveltejs/kit';

import * as v from 'valibot';

import { checkRateLimit } from '$lib/server/ratelimit';
import { requireJson } from '$lib/server/api/validation';
import { addToWaitlist } from '$lib/server/api/waitlist';

const waitlistSchema = v.object({
	email: v.pipe(v.string(), v.email('Please enter a valid email address'), v.maxLength(255))
});

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	// IP-based rate limiting for this public endpoint
	const ip = getClientAddress();
	const ctError = requireJson(request);
	if (ctError) return ctError;

	const rl = await checkRateLimit(`waitlist:${ip}`, 'public');
	if (!rl.success) {
		return Response.json(
			{ error: 'Too many requests. Please try again later.' },
			{
				status: 429,
				headers: { 'Retry-After': String(Math.ceil((rl.reset - Date.now()) / 1000)) }
			}
		);
	}

	try {
		const json = await request.json();
		const { email } = v.parse(waitlistSchema, json);

		await addToWaitlist(email.toLowerCase().trim());
		// Uniform response to prevent email enumeration
		return Response.json({ message: "Thanks! If this email is new, you're on the list." });
	} catch (error) {
		if (error instanceof v.ValiError) {
			return Response.json({ error: 'Validation error', issues: error.issues }, { status: 400 });
		}
		// Handle unique constraint violation (PostgreSQL error code 23505)
		if (error instanceof Error && 'code' in error && (error as { code: string }).code === '23505') {
			// Return same success response to prevent email enumeration
			return Response.json({ message: "Thanks! If this email is new, you're on the list." });
		}
		return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
	}
};
