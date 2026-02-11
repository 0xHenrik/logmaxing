import type { RequestHandler } from '@sveltejs/kit';

import * as v from 'valibot';

import { parseId, requireJson } from '$lib/server/api/validation';
import { updateProgram, deleteProgram, getProgramFull } from '$lib/server/api/programs';

const updateProgramSchema = v.object({
	name: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(200))),
	description: v.optional(v.nullable(v.string())),
	startDate: v.optional(v.nullable(v.string())),
	endDate: v.optional(v.nullable(v.string()))
});

export const GET: RequestHandler = async ({ params, locals }) => {
	const userId = locals.userProfile?.id ?? locals.apiKey?.userId;
	if (!userId) {
		return Response.json({ error: 'Authentication required' }, { status: 401 });
	}

	const id = parseId(params.id);
	if (id === null) {
		return Response.json({ error: 'Invalid ID parameter' }, { status: 400 });
	}

	const data = await getProgramFull(id, userId);
	if (!data) {
		return Response.json({ error: 'Program not found' }, { status: 404 });
	}

	return Response.json(data);
};

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
		const input = v.parse(updateProgramSchema, json);
		const updated = await updateProgram(id, userId, input);
		if (!updated) {
			return Response.json({ error: 'Program not found' }, { status: 404 });
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

	const deleted = await deleteProgram(id, userId);
	if (!deleted) {
		return Response.json({ error: 'Program not found' }, { status: 404 });
	}

	return Response.json({ message: 'Deleted', id });
};
