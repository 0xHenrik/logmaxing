import type { RequestHandler } from '@sveltejs/kit';

import * as v from 'valibot';

import { requireJson } from '$lib/server/api/validation';
import { getPrograms, insertProgram } from '$lib/server/api/programs';

const insertProgramSchema = v.object({
	name: v.pipe(v.string(), v.minLength(1, 'Name is required'), v.maxLength(200)),
	description: v.optional(v.nullable(v.string())),
	startDate: v.optional(v.nullable(v.string())),
	endDate: v.optional(v.nullable(v.string())),
	blocks: v.optional(
		v.array(
			v.object({
				name: v.pipe(v.string(), v.minLength(1)),
				description: v.optional(v.nullable(v.string())),
				sequence: v.optional(v.nullable(v.number())),
				durationWeeks: v.optional(v.nullable(v.number())),
				days: v.optional(
					v.array(
						v.object({
							name: v.pipe(v.string(), v.minLength(1)),
							sequence: v.optional(v.nullable(v.number())),
							workouts: v.optional(
								v.array(
									v.object({
										name: v.optional(v.nullable(v.string())),
										notes: v.optional(v.nullable(v.string())),
										sequence: v.optional(v.nullable(v.number())),
										exercises: v.optional(
											v.array(
												v.object({
													exerciseId: v.pipe(v.number(), v.integer(), v.minValue(1)),
													sets: v.optional(v.nullable(v.number())),
													reps: v.optional(v.nullable(v.string())),
													weight: v.optional(v.nullable(v.number())),
													restSeconds: v.optional(v.nullable(v.number())),
													notes: v.optional(v.nullable(v.string())),
													sequence: v.optional(v.nullable(v.number())),
													groupName: v.optional(v.nullable(v.string()))
												})
											)
										)
									})
								)
							)
						})
					)
				)
			})
		)
	)
});

export const GET: RequestHandler = async ({ url, locals }) => {
	const userId = locals.userProfile?.id ?? locals.apiKey?.userId;
	if (!userId) {
		return Response.json({ error: 'Authentication required' }, { status: 401 });
	}

	const rawLimit = url.searchParams.get('limit');
	const rawOffset = url.searchParams.get('offset');
	const parsedLimit = rawLimit ? Number(rawLimit) : 50;
	const limit = Number.isFinite(parsedLimit)
		? Math.min(Math.max(Math.floor(parsedLimit), 1), 100)
		: 50;
	const offset = Math.max(Number(rawOffset) || 0, 0);

	const data = await getPrograms(userId, limit, offset);
	return Response.json(data);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const userId = locals.userProfile?.id ?? locals.apiKey?.userId;
	if (!userId) {
		return Response.json({ error: 'Authentication required' }, { status: 401 });
	}

	const ctError = requireJson(request);
	if (ctError) return ctError;

	try {
		const json = await request.json();
		const input = v.parse(insertProgramSchema, json);
		const created = await insertProgram(input, userId);
		return Response.json(created, { status: 201 });
	} catch (e) {
		if (e instanceof v.ValiError) {
			return Response.json({ error: 'Validation error', issues: e.issues }, { status: 400 });
		}
		return Response.json({ error: 'Internal server error' }, { status: 500 });
	}
};
