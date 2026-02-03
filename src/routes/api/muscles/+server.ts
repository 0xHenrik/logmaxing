import type { RequestHandler } from '@sveltejs/kit';

import * as v from 'valibot';
import { createInsertSchema } from 'drizzle-valibot';

import { type Muscle, muscle } from '$lib/server/db/schema';
import { getMuscles, insertMuscle } from '$lib/server/api/muscles';

const insertMuscleSchema = createInsertSchema(muscle);

export const GET: RequestHandler = async () => {
	const data = await getMuscles();
	return Response.json(data);
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const json = await request.json();
		const result = v.parse(insertMuscleSchema, json);
		const created = await insertMuscle(result as Omit<Muscle, 'id'>);
		return Response.json(created, { status: 201 });
	} catch (error) {
		if (error instanceof v.ValiError) {
			return Response.json({ error: 'Validation error', issues: error.issues }, { status: 400 });
		}
		if (error instanceof Error) {
			return Response.json({ error: error.message }, { status: 400 });
		}
		return Response.json({ error: 'Internal server error' }, { status: 500 });
	}
};
