import type { RequestHandler } from '@sveltejs/kit';

import * as v from 'valibot';

import { createApiKey, getApiKeysByUser } from '$lib/server/api/apiKeys';

const createKeySchema = v.object({
	name: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
	tier: v.optional(v.picklist(['free', 'developer', 'pro', 'enterprise'])),
	expiresAt: v.optional(v.pipe(v.string(), v.isoTimestamp()))
});

// List user's API keys
export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.apiKey) {
		return Response.json({ error: 'Authentication required' }, { status: 401 });
	}

	const keys = await getApiKeysByUser(locals.apiKey.userId);
	return Response.json(keys);
};

// Create new API key
export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.apiKey) {
		return Response.json({ error: 'Authentication required' }, { status: 401 });
	}

	try {
		const json = await request.json();
		const input = v.parse(createKeySchema, json);

		const result = await createApiKey({
			userId: locals.apiKey.userId,
			name: input.name,
			tier: input.tier,
			expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined
		});

		// Return full key ONLY on creation
		return Response.json(
			{
				key: result.key,
				rawKey: result.rawKey,
				warning: 'Store this key securely. It will not be shown again.'
			},
			{ status: 201 }
		);
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
