import type { RequestHandler } from '@sveltejs/kit';

import * as v from 'valibot';

import { insertWorkoutExercise } from '$lib/server/api/programs';
import { parseId, requireJson } from '$lib/server/api/validation';

const insertWorkoutExerciseSchema = v.object({
	exerciseId: v.pipe(v.number(), v.integer(), v.minValue(1)),
	sets: v.optional(v.nullable(v.number())),
	reps: v.optional(v.nullable(v.string())),
	weight: v.optional(v.nullable(v.number())),
	restSeconds: v.optional(v.nullable(v.number())),
	notes: v.optional(v.nullable(v.string())),
	sequence: v.optional(v.nullable(v.number())),
	groupName: v.optional(v.nullable(v.string()))
});

export const POST: RequestHandler = async ({ request, params, locals }) => {
	const userId = locals.userProfile?.id ?? locals.apiKey?.userId;
	if (!userId) {
		return Response.json({ error: 'Authentication required' }, { status: 401 });
	}

	const workoutId = parseId(params.id);
	if (workoutId === null) {
		return Response.json({ error: 'Invalid workout ID' }, { status: 400 });
	}

	const ctError = requireJson(request);
	if (ctError) return ctError;

	try {
		const json = await request.json();
		const input = v.parse(insertWorkoutExerciseSchema, json);
		const created = await insertWorkoutExercise(workoutId, userId, input);
		if (!created) {
			return Response.json({ error: 'Workout not found' }, { status: 404 });
		}
		return Response.json(created, { status: 201 });
	} catch (e) {
		if (e instanceof v.ValiError) {
			return Response.json({ error: 'Validation error', issues: e.issues }, { status: 400 });
		}
		return Response.json({ error: 'Internal server error' }, { status: 500 });
	}
};
