import type { RequestHandler } from '@sveltejs/kit';

import * as v from 'valibot';

import { addToWaitlist } from '$lib/server/api/waitlist';

const waitlistSchema = v.object({
	email: v.pipe(v.string(), v.email('Please enter a valid email address'), v.maxLength(255))
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		const json = await request.json();
		const { email } = v.parse(waitlistSchema, json);

		const created = await addToWaitlist(email.toLowerCase().trim());
		return Response.json({ message: "You're on the list!", id: created.id }, { status: 201 });
	} catch (error) {
		if (error instanceof v.ValiError) {
			return Response.json({ error: 'Validation error', issues: error.issues }, { status: 400 });
		}
		if (error instanceof Error && error.message.includes('unique')) {
			return Response.json({ error: "You're already on the waitlist!" }, { status: 409 });
		}
		return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
	}
};
