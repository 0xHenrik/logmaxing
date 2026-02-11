import type { RequestHandler } from '@sveltejs/kit';

import * as v from 'valibot';

import { parseId, requireJson } from '$lib/server/api/validation';
import { updateWorkoutExercise, deleteWorkoutExercise } from '$lib/server/api/programs';

const updateWorkoutExerciseSchema = v.object({
	exerciseId: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
	sets: v.optional(v.nullable(v.number())),
	reps: v.optional(v.nullable(v.string())),
	weight: v.optional(v.nullable(v.number())),
	restSeconds: v.optional(v.nullable(v.number())),
	notes: v.optional(v.nullable(v.string())),
	sequence: v.optional(v.nullable(v.number())),
	groupName: v.optional(v.nullable(v.string()))
});

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	const userId = locals.userProfile?.id ?? locals.apiKey?.userId;
	if (!userId) {
		return Response.json({ error: 'Authentication required' }, { status: 401 });
	}

	const id = parseId(params.id);
	if (id === null) {
		return Response.json({ error: 'Invalid ID parameter' }, { status: 400 });
	}

	const ctError = requireJson(request);
	if (ctError) return ctError;

	try {
		const json = await request.json();
		const input = v.parse(updateWorkoutExerciseSchema, json);
		const updated = await updateWorkoutExercise(id, userId, input);
		if (!updated) {
			return Response.json({ error: 'Workout exercise not found' }, { status: 404 });
		}
		return Response.json({ message: 'Updated' });
	} catch (e) {
		if (e instanceof v.ValiError) {
			return Response.json({ error: 'Validation error', issues: e.issues }, { status: 400 });
		}
		return Response.json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const userId = locals.userProfile?.id ?? locals.apiKey?.userId;
	if (!userId) {
		return Response.json({ error: 'Authentication required' }, { status: 401 });
	}

	const id = parseId(params.id);
	if (id === null) {
		return Response.json({ error: 'Invalid ID parameter' }, { status: 400 });
	}

	const deleted = await deleteWorkoutExercise(id, userId);
	if (!deleted) {
		return Response.json({ error: 'Workout exercise not found' }, { status: 404 });
	}

	return Response.json({ message: 'Deleted', id });
};
