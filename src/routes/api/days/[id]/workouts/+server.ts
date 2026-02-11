import type { RequestHandler } from '@sveltejs/kit';

import * as v from 'valibot';

import { insertWorkout } from '$lib/server/api/programs';
import { parseId, requireJson } from '$lib/server/api/validation';

const insertWorkoutSchema = v.object({
	name: v.optional(v.nullable(v.string())),
	notes: v.optional(v.nullable(v.string())),
	sequence: v.optional(v.nullable(v.number()))
});

export const POST: RequestHandler = async ({ request, params, locals }) => {
	const userId = locals.userProfile?.id ?? locals.apiKey?.userId;
	if (!userId) {
		return Response.json({ error: 'Authentication required' }, { status: 401 });
	}

	const dayId = parseId(params.id);
	if (dayId === null) {
		return Response.json({ error: 'Invalid day ID' }, { status: 400 });
	}

	const ctError = requireJson(request);
	if (ctError) return ctError;

	try {
		const json = await request.json();
		const input = v.parse(insertWorkoutSchema, json);
		const created = await insertWorkout(dayId, userId, input);
		if (!created) {
			return Response.json({ error: 'Day not found' }, { status: 404 });
		}
		return Response.json(created, { status: 201 });
	} catch (e) {
		if (e instanceof v.ValiError) {
			return Response.json({ error: 'Validation error', issues: e.issues }, { status: 400 });
		}
		return Response.json({ error: 'Internal server error' }, { status: 500 });
	}
};
