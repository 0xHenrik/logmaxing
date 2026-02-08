import type { RequestHandler } from '@sveltejs/kit';

import * as v from 'valibot';

import { requireJson } from '$lib/server/api/validation';
import { KEY_LIMITS, createApiKey, getApiKeysByUser } from '$lib/server/api/apiKeys';

const createKeySchema = v.object({
	name: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
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

	const ctError = requireJson(request);
	if (ctError) return ctError;

	// Enforce per-user key limits by tier
	const maxKeys = KEY_LIMITS[locals.apiKey.tier] ?? 1;
	const existingKeys = await getApiKeysByUser(locals.apiKey.userId);
	const activeKeyCount = existingKeys.filter((k) => k.isActive && !k.revokedAt).length;
	if (activeKeyCount >= maxKeys) {
		return Response.json(
			{
				error: 'Key limit reached',
				message: `Maximum of ${maxKeys} active keys for your ${locals.apiKey.tier} tier.`
			},
			{ status: 403 }
		);
	}

	try {
		const json = await request.json();
		const input = v.parse(createKeySchema, json);

		const result = await createApiKey({
			userId: locals.apiKey.userId,
			name: input.name,
			tier: 'free',
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
