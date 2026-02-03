import type { RequestHandler } from '@sveltejs/kit';

import * as v from 'valibot';
import { createUpdateSchema } from 'drizzle-valibot';

import { muscle } from '$lib/server/db/schema';
import { getMuscle, updateMuscle, deleteMuscle } from '$lib/server/api/muscles';

const updateMuscleSchema = createUpdateSchema(muscle);

export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;
	const data = await getMuscle(Number(id));
	if (!data) {
		return new Response('not found', { status: 404 });
	}
	return Response.json(data);
};

export const PUT: RequestHandler = async ({ request, params }) => {
	const { id } = params;
	try {
		const json = await request.json();
		const result = v.parse(updateMuscleSchema, json);
		await updateMuscle(Number(id), result);
		return new Response('updated', { status: 200 });
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

export const DELETE: RequestHandler = async ({ params }) => {
	const { id } = params;
	const data = await deleteMuscle(Number(id));
	if (!data) {
		return new Response('not found', { status: 404 });
	}
	return new Response('deleted muscle:' + data.deletedId, { status: 200 });
};
