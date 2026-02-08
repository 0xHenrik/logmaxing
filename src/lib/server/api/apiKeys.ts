import { createHash, randomBytes } from 'crypto';

import { eq, and, sql } from 'drizzle-orm';

import { db } from '../db';
import { type ApiKey, apiKey, userProfile } from '../db/schema';

// ============ TYPES ============

export type ApiKeyTier = 'free' | 'developer' | 'pro' | 'enterprise';

export const KEY_LIMITS: Record<ApiKeyTier, number> = {
	free: 1,
	developer: 5,
	pro: 15,
	enterprise: 50
};

export interface CreateApiKeyInput {
	userId: number;
	name: string;
	tier?: ApiKeyTier;
	expiresAt?: Date;
}

export interface CreateApiKeyResult {
	key: ApiKey;
	rawKey: string; // Only returned once on creation!
}

export interface ValidatedApiKey {
	id: number;
	userId: number;
	tier: ApiKeyTier;
	name: string;
}

// ============ KEY GENERATION ============

/**
 * Generate a cryptographically secure API key.
 * Format: lmx_<43 chars base62>
 * Total entropy: 256 bits (32 bytes)
 */
function generateRawKey(): string {
	const randomPart = randomBytes(32).toString('base64url').slice(0, 43);
	return `lmx_${randomPart}`;
}

/**
 * Hash a raw API key using SHA-256.
 * This is appropriate for high-entropy secrets (not passwords).
 */
function hashKey(rawKey: string): string {
	return createHash('sha256').update(rawKey).digest('hex');
}

/**
 * Extract prefix for display purposes.
 * Shows enough to identify the key without exposing the full value.
 */
function extractPrefix(rawKey: string): string {
	return rawKey.slice(0, 16);
}

// ============ CRUD OPERATIONS ============

/**
 * Create a new API key for a user.
 * IMPORTANT: The rawKey is only returned once. Store it securely!
 */
export async function createApiKey(input: CreateApiKeyInput): Promise<CreateApiKeyResult> {
	const rawKey = generateRawKey();
	const keyHash = hashKey(rawKey);
	const keyPrefix = extractPrefix(rawKey);

	const [created] = await db
		.insert(apiKey)
		.values({
			userId: input.userId,
			name: input.name,
			tier: input.tier ?? 'free',
			keyPrefix,
			keyHash,
			expiresAt: input.expiresAt ?? null
		})
		.returning();

	return { key: created, rawKey };
}

/**
 * Validate an API key and return its metadata if valid.
 * Returns null if the key is invalid, revoked, or expired.
 */
export async function validateApiKey(rawKey: string): Promise<ValidatedApiKey | null> {
	// Quick format check
	if (!rawKey.startsWith('lmx_')) {
		return null;
	}

	const keyHash = hashKey(rawKey);

	const [result] = await db
		.select({
			id: apiKey.id,
			userId: apiKey.userId,
			name: apiKey.name,
			isActive: apiKey.isActive,
			revokedAt: apiKey.revokedAt,
			expiresAt: apiKey.expiresAt,
			subscriptionTier: userProfile.subscriptionTier
		})
		.from(apiKey)
		.innerJoin(userProfile, eq(apiKey.userId, userProfile.id))
		.where(eq(apiKey.keyHash, keyHash));

	if (!result) return null;

	// Check if key is usable
	if (!result.isActive || result.revokedAt) return null;
	if (result.expiresAt && result.expiresAt < new Date()) return null;

	// Update usage metadata (fire and forget - don't block response)
	updateKeyUsage(result.id).catch((err) => {
		console.error(`Failed to update usage for key ${result.id}:`, err);
	});

	// Use the user's subscription tier (all keys inherit user tier)
	const validTiers: ApiKeyTier[] = ['free', 'developer', 'pro', 'enterprise'];
	const tier = validTiers.includes(result.subscriptionTier as ApiKeyTier)
		? (result.subscriptionTier as ApiKeyTier)
		: 'free';

	return {
		id: result.id,
		userId: result.userId,
		tier,
		name: result.name
	};
}

/**
 * Update key usage statistics (last used time and count).
 * Called asynchronously after successful validation.
 */
async function updateKeyUsage(keyId: number): Promise<void> {
	await db
		.update(apiKey)
		.set({
			lastUsedAt: new Date(),
			usageCount: sql`${apiKey.usageCount} + 1`
		})
		.where(eq(apiKey.id, keyId));
}

/**
 * Revoke an API key (soft delete).
 * The key is marked as inactive and revokedAt is set.
 * Returns true if a key was revoked, false if not found or not owned by user.
 */
export async function revokeApiKey(keyId: number, userId: number): Promise<boolean> {
	const [result] = await db
		.update(apiKey)
		.set({
			isActive: false,
			revokedAt: new Date()
		})
		.where(and(eq(apiKey.id, keyId), eq(apiKey.userId, userId)))
		.returning({ id: apiKey.id });

	return !!result;
}

/**
 * Get all API keys for a user (without the hash).
 */
export async function getApiKeysByUser(userId: number): Promise<Omit<ApiKey, 'keyHash'>[]> {
	const results = await db
		.select({
			id: apiKey.id,
			userId: apiKey.userId,
			keyPrefix: apiKey.keyPrefix,
			name: apiKey.name,
			tier: apiKey.tier,
			lastUsedAt: apiKey.lastUsedAt,
			usageCount: apiKey.usageCount,
			createdAt: apiKey.createdAt,
			expiresAt: apiKey.expiresAt,
			revokedAt: apiKey.revokedAt,
			isActive: apiKey.isActive
		})
		.from(apiKey)
		.where(eq(apiKey.userId, userId))
		.orderBy(apiKey.createdAt);

	return results;
}

/**
 * Get a single API key by ID (without the hash).
 * Only returns the key if it belongs to the specified user.
 */
export async function getApiKeyById(
	keyId: number,
	userId: number
): Promise<Omit<ApiKey, 'keyHash'> | null> {
	const [result] = await db
		.select({
			id: apiKey.id,
			userId: apiKey.userId,
			keyPrefix: apiKey.keyPrefix,
			name: apiKey.name,
			tier: apiKey.tier,
			lastUsedAt: apiKey.lastUsedAt,
			usageCount: apiKey.usageCount,
			createdAt: apiKey.createdAt,
			expiresAt: apiKey.expiresAt,
			revokedAt: apiKey.revokedAt,
			isActive: apiKey.isActive
		})
		.from(apiKey)
		.where(and(eq(apiKey.id, keyId), eq(apiKey.userId, userId)));

	return result ?? null;
}

/**
 * Permanently delete an API key.
 * Returns true if deleted, false if not found or not owned by user.
 */
export async function deleteApiKey(keyId: number, userId: number): Promise<boolean> {
	const [result] = await db
		.delete(apiKey)
		.where(and(eq(apiKey.id, keyId), eq(apiKey.userId, userId)))
		.returning({ id: apiKey.id });

	return !!result;
}
