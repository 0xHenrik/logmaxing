import type { RequestHandler } from '@sveltejs/kit';

import * as v from 'valibot';

import { updateDay, deleteDay } from '$lib/server/api/programs';
import { parseId, requireJson } from '$lib/server/api/validation';

const updateDaySchema = v.object({
	name: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(200))),
	sequence: v.optional(v.nullable(v.number()))
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
		const input = v.parse(updateDaySchema, json);
		const updated = await updateDay(id, userId, input);
		if (!updated) {
			return Response.json({ error: 'Day not found' }, { status: 404 });
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

	const deleted = await deleteDay(id, userId);
	if (!deleted) {
		return Response.json({ error: 'Day not found' }, { status: 404 });
	}

	return Response.json({ message: 'Deleted', id });
};
