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
	} catch (e) {
		return Response.json(e, { status: 400 });
	}
};
