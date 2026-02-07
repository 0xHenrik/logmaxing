import type { RequestHandler } from '@sveltejs/kit';

import * as v from 'valibot';
import { createUpdateSchema } from 'drizzle-valibot';

import { muscle } from '$lib/server/db/schema';
import { parseId, requireJson } from '$lib/server/api/validation';
import { getMuscle, updateMuscle, deleteMuscle } from '$lib/server/api/muscles';

const updateMuscleSchema = createUpdateSchema(muscle);

export const GET: RequestHandler = async ({ params }) => {
	const id = parseId(params.id);
	if (id === null) {
		return Response.json({ error: 'Invalid ID parameter' }, { status: 400 });
	}

	const data = await getMuscle(id);
	if (!data) {
		return Response.json({ error: 'Not found' }, { status: 404 });
	}
	return Response.json(data);
};

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.apiKey || locals.apiKey.tier !== 'enterprise') {
		return Response.json({ error: 'Forbidden: admin access required' }, { status: 403 });
	}

	const id = parseId(params.id);
	if (id === null) {
		return Response.json({ error: 'Invalid ID parameter' }, { status: 400 });
	}

	const ctError = requireJson(request);
	if (ctError) return ctError;

	try {
		const json = await request.json();
		const result = v.parse(updateMuscleSchema, json);
		await updateMuscle(id, result);
		return Response.json({ message: 'Updated' });
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

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.apiKey || locals.apiKey.tier !== 'enterprise') {
		return Response.json({ error: 'Forbidden: admin access required' }, { status: 403 });
	}

	const id = parseId(params.id);
	if (id === null) {
		return Response.json({ error: 'Invalid ID parameter' }, { status: 400 });
	}

	const data = await deleteMuscle(id);
	if (!data) {
		return Response.json({ error: 'Not found' }, { status: 404 });
	}
	return Response.json({ message: 'Deleted', id: data.deletedId });
};
