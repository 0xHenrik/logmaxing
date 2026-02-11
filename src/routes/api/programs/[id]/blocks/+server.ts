import type { RequestHandler } from '@sveltejs/kit';

import * as v from 'valibot';

import { insertBlock } from '$lib/server/api/programs';
import { parseId, requireJson } from '$lib/server/api/validation';

const insertBlockSchema = v.object({
	name: v.pipe(v.string(), v.minLength(1), v.maxLength(200)),
	description: v.optional(v.nullable(v.string())),
	sequence: v.optional(v.nullable(v.number())),
	durationWeeks: v.optional(v.nullable(v.number()))
});

export const POST: RequestHandler = async ({ request, params, locals }) => {
	const userId = locals.userProfile?.id ?? locals.apiKey?.userId;
	if (!userId) {
		return Response.json({ error: 'Authentication required' }, { status: 401 });
	}

	const programId = parseId(params.id);
	if (programId === null) {
		return Response.json({ error: 'Invalid program ID' }, { status: 400 });
	}

	const ctError = requireJson(request);
	if (ctError) return ctError;

	try {
		const json = await request.json();
		const input = v.parse(insertBlockSchema, json);
		const created = await insertBlock(programId, userId, input);
		if (!created) {
			return Response.json({ error: 'Program not found' }, { status: 404 });
		}
		return Response.json(created, { status: 201 });
	} catch (e) {
		if (e instanceof v.ValiError) {
			return Response.json({ error: 'Validation error', issues: e.issues }, { status: 400 });
		}
		return Response.json({ error: 'Internal server error' }, { status: 500 });
	}
};
