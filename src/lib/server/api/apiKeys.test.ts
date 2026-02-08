import { createHash } from 'crypto';

import { it, vi, expect, describe, beforeEach } from 'vitest';

// Mock the database module before importing anything that uses it
vi.mock('../db', () => ({
	db: {
		select: vi.fn().mockReturnThis(),
		insert: vi.fn().mockReturnThis(),
		update: vi.fn().mockReturnThis(),
		delete: vi.fn().mockReturnThis(),
		from: vi.fn().mockReturnThis(),
		where: vi.fn(),
		values: vi.fn().mockReturnThis(),
		returning: vi.fn(),
		set: vi.fn().mockReturnThis(),
		orderBy: vi.fn()
	}
}));

import { db } from '../db';
import {
	createApiKey,
	revokeApiKey,
	deleteApiKey,
	getApiKeyById,
	validateApiKey,
	getApiKeysByUser
} from './apiKeys';

// Helper: compute SHA-256 hash the same way apiKeys.ts does
function hashKey(rawKey: string): string {
	return createHash('sha256').update(rawKey).digest('hex');
}

// ============ createApiKey ============

describe('createApiKey', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('creates a key and returns raw key + created record', async () => {
		const mockCreated = {
			id: 1,
			userId: 42,
			name: 'Test Key',
			tier: 'free',
			keyPrefix: 'lmx_some_prefix_',
			keyHash: 'somehash',
			isActive: true,
			createdAt: new Date(),
			expiresAt: null,
			revokedAt: null,
			lastUsedAt: null,
			usageCount: 0
		};

		const mockReturning = vi.fn().mockResolvedValue([mockCreated]);
		const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
		const mockInsert = vi.fn().mockReturnValue({ values: mockValues });
		vi.mocked(db.insert).mockImplementation(mockInsert);

		const result = await createApiKey({ userId: 42, name: 'Test Key' });

		expect(result.rawKey).toMatch(/^lmx_/);
		expect(result.rawKey.length).toBe(47); // lmx_ (4) + 43 chars
		expect(result.key).toEqual(mockCreated);
	});

	it('uses default tier "free" when not specified', async () => {
		const mockReturning = vi.fn().mockResolvedValue([{ id: 1 }]);
		const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
		const mockInsert = vi.fn().mockReturnValue({ values: mockValues });
		vi.mocked(db.insert).mockImplementation(mockInsert);

		await createApiKey({ userId: 1, name: 'Test' });

		const valuesArg = mockValues.mock.calls[0][0];
		expect(valuesArg.tier).toBe('free');
	});

	it('uses specified tier when provided', async () => {
		const mockReturning = vi.fn().mockResolvedValue([{ id: 1 }]);
		const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
		const mockInsert = vi.fn().mockReturnValue({ values: mockValues });
		vi.mocked(db.insert).mockImplementation(mockInsert);

		await createApiKey({ userId: 1, name: 'Pro Key', tier: 'pro' });

		const valuesArg = mockValues.mock.calls[0][0];
		expect(valuesArg.tier).toBe('pro');
	});

	it('stores hash, not raw key', async () => {
		const mockReturning = vi.fn().mockResolvedValue([{ id: 1 }]);
		const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
		const mockInsert = vi.fn().mockReturnValue({ values: mockValues });
		vi.mocked(db.insert).mockImplementation(mockInsert);

		const result = await createApiKey({ userId: 1, name: 'Test' });

		const valuesArg = mockValues.mock.calls[0][0];
		const expectedHash = hashKey(result.rawKey);
		expect(valuesArg.keyHash).toBe(expectedHash);
		expect(valuesArg.keyHash).not.toBe(result.rawKey);
	});

	it('stores key prefix (first 16 chars)', async () => {
		const mockReturning = vi.fn().mockResolvedValue([{ id: 1 }]);
		const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
		const mockInsert = vi.fn().mockReturnValue({ values: mockValues });
		vi.mocked(db.insert).mockImplementation(mockInsert);

		const result = await createApiKey({ userId: 1, name: 'Test' });

		const valuesArg = mockValues.mock.calls[0][0];
		expect(valuesArg.keyPrefix).toBe(result.rawKey.slice(0, 16));
	});
});

// ============ validateApiKey ============

describe('validateApiKey', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const testRawKey = 'lmx_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklm';

	function mockDbSelect(result: unknown[] | undefined) {
		const mockWhere = vi.fn().mockResolvedValue(result ?? []);
		const mockInnerJoin = vi.fn().mockReturnValue({ where: mockWhere });
		const mockFrom = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin, where: mockWhere });
		vi.mocked(db.select).mockReturnValue({ from: mockFrom } as unknown as ReturnType<
			typeof db.select
		>);
		// Also mock update for the fire-and-forget updateKeyUsage
		const mockUpdateWhere = vi.fn().mockResolvedValue([]);
		const mockUpdateSet = vi.fn().mockReturnValue({ where: mockUpdateWhere });
		const mockUpdate = vi.fn().mockReturnValue({ set: mockUpdateSet });
		vi.mocked(db.update).mockImplementation(mockUpdate);
	}

	it('returns validated key for active, non-expired key', async () => {
		mockDbSelect([
			{
				id: 1,
				userId: 42,
				subscriptionTier: 'pro',
				name: 'My Key',
				isActive: true,
				revokedAt: null,
				expiresAt: null
			}
		]);

		const result = await validateApiKey(testRawKey);

		expect(result).toEqual({
			id: 1,
			userId: 42,
			tier: 'pro',
			name: 'My Key'
		});
	});

	it('returns null for key without lmx_ prefix', async () => {
		const result = await validateApiKey('invalid_key_without_prefix');
		expect(result).toBeNull();
		// Should not even hit the DB
		expect(db.select).not.toHaveBeenCalled();
	});

	it('returns null for empty string', async () => {
		const result = await validateApiKey('');
		expect(result).toBeNull();
	});

	it('returns null when key not found in DB', async () => {
		mockDbSelect([]);

		const result = await validateApiKey(testRawKey);
		expect(result).toBeNull();
	});

	it('returns null for revoked key', async () => {
		mockDbSelect([
			{
				id: 1,
				userId: 42,
				subscriptionTier: 'free',
				name: 'Revoked Key',
				isActive: false,
				revokedAt: new Date('2026-01-01'),
				expiresAt: null
			}
		]);

		const result = await validateApiKey(testRawKey);
		expect(result).toBeNull();
	});

	it('returns null for inactive key', async () => {
		mockDbSelect([
			{
				id: 1,
				userId: 42,
				subscriptionTier: 'free',
				name: 'Inactive Key',
				isActive: false,
				revokedAt: null,
				expiresAt: null
			}
		]);

		const result = await validateApiKey(testRawKey);
		expect(result).toBeNull();
	});

	it('returns null for expired key', async () => {
		mockDbSelect([
			{
				id: 1,
				userId: 42,
				subscriptionTier: 'free',
				name: 'Expired Key',
				isActive: true,
				revokedAt: null,
				expiresAt: new Date('2020-01-01') // in the past
			}
		]);

		const result = await validateApiKey(testRawKey);
		expect(result).toBeNull();
	});

	it('returns key when expiresAt is in the future', async () => {
		mockDbSelect([
			{
				id: 1,
				userId: 42,
				subscriptionTier: 'developer',
				name: 'Future Key',
				isActive: true,
				revokedAt: null,
				expiresAt: new Date('2099-01-01')
			}
		]);

		const result = await validateApiKey(testRawKey);
		expect(result).not.toBeNull();
		expect(result!.tier).toBe('developer');
	});

	it('defaults to "free" tier for invalid subscriptionTier value in DB', async () => {
		mockDbSelect([
			{
				id: 1,
				userId: 42,
				subscriptionTier: 'invalid_tier',
				name: 'Bad Tier',
				isActive: true,
				revokedAt: null,
				expiresAt: null
			}
		]);

		const result = await validateApiKey(testRawKey);
		expect(result).not.toBeNull();
		expect(result!.tier).toBe('free');
	});
});

// ============ revokeApiKey ============

describe('revokeApiKey', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns true when key is revoked successfully', async () => {
		const mockReturning = vi.fn().mockResolvedValue([{ id: 5 }]);
		const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
		const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
		const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });
		vi.mocked(db.update).mockImplementation(mockUpdate);

		const result = await revokeApiKey(5, 42);
		expect(result).toBe(true);
	});

	it('returns false when key not found', async () => {
		const mockReturning = vi.fn().mockResolvedValue([]);
		const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
		const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
		const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });
		vi.mocked(db.update).mockImplementation(mockUpdate);

		const result = await revokeApiKey(999, 42);
		expect(result).toBe(false);
	});
});

// ============ getApiKeysByUser ============

describe('getApiKeysByUser', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns keys for user', async () => {
		const mockKeys = [
			{ id: 1, userId: 42, keyPrefix: 'lmx_test1______', name: 'Key 1' },
			{ id: 2, userId: 42, keyPrefix: 'lmx_test2______', name: 'Key 2' }
		];

		const mockOrderBy = vi.fn().mockResolvedValue(mockKeys);
		const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
		const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
		vi.mocked(db.select).mockReturnValue({ from: mockFrom } as unknown as ReturnType<
			typeof db.select
		>);

		const result = await getApiKeysByUser(42);
		expect(result).toEqual(mockKeys);
		expect(result.length).toBe(2);
	});

	it('returns empty array for user with no keys', async () => {
		const mockOrderBy = vi.fn().mockResolvedValue([]);
		const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
		const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
		vi.mocked(db.select).mockReturnValue({ from: mockFrom } as unknown as ReturnType<
			typeof db.select
		>);

		const result = await getApiKeysByUser(999);
		expect(result).toEqual([]);
	});
});

// ============ getApiKeyById ============

describe('getApiKeyById', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns key when found and owned by user', async () => {
		const mockKey = { id: 5, userId: 42, keyPrefix: 'lmx_test_______', name: 'My Key' };

		const mockWhere = vi.fn().mockResolvedValue([mockKey]);
		const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
		vi.mocked(db.select).mockReturnValue({ from: mockFrom } as unknown as ReturnType<
			typeof db.select
		>);

		const result = await getApiKeyById(5, 42);
		expect(result).toEqual(mockKey);
	});

	it('returns null when key not found', async () => {
		const mockWhere = vi.fn().mockResolvedValue([]);
		const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
		vi.mocked(db.select).mockReturnValue({ from: mockFrom } as unknown as ReturnType<
			typeof db.select
		>);

		const result = await getApiKeyById(999, 42);
		expect(result).toBeNull();
	});
});

// ============ deleteApiKey ============

describe('deleteApiKey', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns true when key is deleted', async () => {
		const mockReturning = vi.fn().mockResolvedValue([{ id: 5 }]);
		const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
		const mockDelete = vi.fn().mockReturnValue({ where: mockWhere });
		vi.mocked(db.delete).mockImplementation(mockDelete);

		const result = await deleteApiKey(5, 42);
		expect(result).toBe(true);
	});

	it('returns false when key not found', async () => {
		const mockReturning = vi.fn().mockResolvedValue([]);
		const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
		const mockDelete = vi.fn().mockReturnValue({ where: mockWhere });
		vi.mocked(db.delete).mockImplementation(mockDelete);

		const result = await deleteApiKey(999, 42);
		expect(result).toBe(false);
	});
});
