import type { Actions } from './$types';
import type { ApiKeyTier } from '$lib/server/api/apiKeys';

import * as v from 'valibot';
import { fail, redirect } from '@sveltejs/kit';

import { getOrCreateUserProfile } from '$lib/server/api/userProfile';
import {
	KEY_LIMITS,
	createApiKey,
	deleteApiKey,
	revokeApiKey,
	getApiKeysByUser
} from '$lib/server/api/apiKeys';

const createKeySchema = v.object({
	name: v.pipe(
		v.string(),
		v.minLength(1, 'Name is required'),
		v.maxLength(100, 'Name must be 100 characters or less')
	)
});

async function getProfile(locals: App.Locals) {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) redirect(303, '/sign-in');

	return getOrCreateUserProfile(user.id, user.email ?? '');
}

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const profile = await getProfile(locals);

		const existing = await getApiKeysByUser(profile.id);
		const activeCount = existing.filter((k) => k.isActive && !k.revokedAt).length;
		const tier = (existing[0]?.tier ?? 'free') as ApiKeyTier;
		const maxKeys = KEY_LIMITS[tier] ?? 1;

		if (activeCount >= maxKeys) {
			return fail(403, {
				action: 'create' as const,
				error: `Maximum of ${maxKeys} active key${maxKeys === 1 ? '' : 's'} for your ${tier} tier.`
			});
		}

		const formData = await request.formData();
		const name = formData.get('name')?.toString() ?? '';

		try {
			const input = v.parse(createKeySchema, { name });
			const result = await createApiKey({
				userId: profile.id,
				name: input.name,
				tier: 'free'
			});

			return {
				created: true as const,
				rawKey: result.rawKey,
				keyPrefix: result.key.keyPrefix,
				keyName: result.key.name
			};
		} catch (e) {
			if (e instanceof v.ValiError) {
				return fail(400, {
					action: 'create' as const,
					error: e.issues[0]?.message ?? 'Validation error'
				});
			}
			return fail(500, { action: 'create' as const, error: 'Failed to create key' });
		}
	},

	revoke: async ({ request, locals }) => {
		const profile = await getProfile(locals);
		const formData = await request.formData();
		const keyId = Number(formData.get('keyId'));

		if (!keyId || keyId < 1) {
			return fail(400, { action: 'revoke' as const, error: 'Invalid key ID' });
		}

		const revoked = await revokeApiKey(keyId, profile.id);
		if (!revoked) {
			return fail(404, { action: 'revoke' as const, error: 'Key not found' });
		}

		return { revoked: true as const };
	},

	delete: async ({ request, locals }) => {
		const profile = await getProfile(locals);
		const formData = await request.formData();
		const keyId = Number(formData.get('keyId'));

		if (!keyId || keyId < 1) {
			return fail(400, { action: 'delete' as const, error: 'Invalid key ID' });
		}

		const deleted = await deleteApiKey(keyId, profile.id);
		if (!deleted) {
			return fail(404, { action: 'delete' as const, error: 'Key not found' });
		}

		return { deleted: true as const };
	}
};
