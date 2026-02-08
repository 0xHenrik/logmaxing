import type { LayoutServerLoad } from './$types';
import type { ApiKeyTier } from '$lib/server/api/apiKeys';

import { redirect } from '@sveltejs/kit';

import { getOrCreateUserProfile } from '$lib/server/api/userProfile';
import { KEY_LIMITS, getApiKeysByUser } from '$lib/server/api/apiKeys';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session || !user) {
		redirect(303, '/sign-in');
	}

	const profile = await getOrCreateUserProfile(
		user.id,
		user.email ?? '',
		user.user_metadata?.full_name ?? user.user_metadata?.name
	);

	const keys = await getApiKeysByUser(profile.id);

	const activeKeys = keys.filter((k) => k.isActive && !k.revokedAt);
	const totalUsage = keys.reduce((sum, k) => sum + k.usageCount, 0);
	const tier = (profile.subscriptionTier ?? 'free') as ApiKeyTier;

	return {
		profile: {
			id: profile.id,
			email: profile.email,
			name: profile.name,
			subscriptionTier: profile.subscriptionTier ?? 'free',
			subscriptionStatus: profile.subscriptionStatus,
			subscriptionCurrentPeriodEnd: profile.subscriptionCurrentPeriodEnd
				? profile.subscriptionCurrentPeriodEnd.toISOString()
				: null
		},
		keys,
		stats: {
			totalKeys: keys.length,
			activeKeys: activeKeys.length,
			totalUsage,
			tier,
			keyLimit: KEY_LIMITS[tier] ?? 1
		}
	};
};
