import type { LayoutServerLoad } from './$types';
import type { ApiKeyTier } from '$lib/server/api/apiKeys';

import { redirect } from '@sveltejs/kit';

import { getOrCreateUserProfile } from '$lib/server/api/userProfile';
import { KEY_LIMITS, getApiKeysBySupabaseUser } from '$lib/server/api/apiKeys';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session || !user) {
		redirect(303, '/sign-in');
	}

	// Run both queries in parallel — keys query uses JOIN so it doesn't need profile.id
	const [profile, keys] = await Promise.all([
		getOrCreateUserProfile(
			user.id,
			user.email ?? '',
			user.user_metadata?.full_name ?? user.user_metadata?.name
		),
		getApiKeysBySupabaseUser(user.id)
	]);

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
