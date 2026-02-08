import { eq } from 'drizzle-orm';

import { db } from '../db';
import { type UserProfile, userProfile } from '../db/schema';

export async function getUserProfileBySupabaseId(
	supabaseUserId: string
): Promise<UserProfile | null> {
	const [result] = await db
		.select()
		.from(userProfile)
		.where(eq(userProfile.supabaseUserId, supabaseUserId));
	return result ?? null;
}

export async function getOrCreateUserProfile(
	supabaseUserId: string,
	email: string,
	name?: string
): Promise<UserProfile> {
	const existing = await getUserProfileBySupabaseId(supabaseUserId);
	if (existing) return existing;

	const [created] = await db
		.insert(userProfile)
		.values({ supabaseUserId, email, name: name ?? null })
		.returning();
	return created;
}
