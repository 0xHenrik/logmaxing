import { it, vi, expect, describe, beforeEach } from 'vitest';

// Mock SvelteKit environment modules before importing
vi.mock('$app/environment', () => ({
	building: false
}));

vi.mock('$env/dynamic/private', () => ({
	env: {}
}));

vi.mock('@upstash/redis', () => ({
	Redis: vi.fn()
}));

vi.mock('@upstash/ratelimit', () => ({
	Ratelimit: vi.fn()
}));

import { RATE_LIMITS, checkRateLimit, getRateLimitHeaders } from './ratelimit';

// ============ RATE_LIMITS constants ============

describe('RATE_LIMITS', () => {
	it('defines all expected tiers', () => {
		expect(RATE_LIMITS).toHaveProperty('public');
		expect(RATE_LIMITS).toHaveProperty('auth_attempt');
		expect(RATE_LIMITS).toHaveProperty('free');
		expect(RATE_LIMITS).toHaveProperty('developer');
		expect(RATE_LIMITS).toHaveProperty('pro');
		expect(RATE_LIMITS).toHaveProperty('enterprise');
	});

	it('has correct limits for free tier', () => {
		expect(RATE_LIMITS.free.requests).toBe(100);
		expect(RATE_LIMITS.free.window).toBe('1 d');
	});

	it('has correct limits for developer tier', () => {
		expect(RATE_LIMITS.developer.requests).toBe(170);
	});

	it('has correct limits for pro tier', () => {
		expect(RATE_LIMITS.pro.requests).toBe(850);
	});

	it('has correct limits for enterprise tier', () => {
		expect(RATE_LIMITS.enterprise.requests).toBe(3400);
	});

	it('has correct limits for auth_attempt', () => {
		expect(RATE_LIMITS.auth_attempt.requests).toBe(20);
		expect(RATE_LIMITS.auth_attempt.window).toBe('15 m');
	});

	it('has correct limits for public', () => {
		expect(RATE_LIMITS.public.requests).toBe(10);
		expect(RATE_LIMITS.public.window).toBe('1 d');
	});

	it('tiers are ordered by increasing limits', () => {
		expect(RATE_LIMITS.free.requests).toBeLessThan(RATE_LIMITS.developer.requests);
		expect(RATE_LIMITS.developer.requests).toBeLessThan(RATE_LIMITS.pro.requests);
		expect(RATE_LIMITS.pro.requests).toBeLessThan(RATE_LIMITS.enterprise.requests);
	});
});

// ============ getRateLimitHeaders ============

describe('getRateLimitHeaders', () => {
	it('returns correct header names and string values', () => {
		const result = getRateLimitHeaders({
			success: true,
			limit: 100,
			remaining: 99,
			reset: 1700000000000
		});

		expect(result['X-RateLimit-Limit']).toBe('100');
		expect(result['X-RateLimit-Remaining']).toBe('99');
		expect(result['X-RateLimit-Reset']).toBe('1700000000000');
	});

	it('returns string values even for zero remaining', () => {
		const result = getRateLimitHeaders({
			success: false,
			limit: 10,
			remaining: 0,
			reset: 1700000000000
		});

		expect(result['X-RateLimit-Remaining']).toBe('0');
	});
});

// ============ checkRateLimit (in-memory fallback) ============

describe('checkRateLimit (in-memory fallback)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('allows first request', async () => {
		const result = await checkRateLimit('test-user-first', 'free');
		expect(result.success).toBe(true);
		expect(result.limit).toBe(100);
		expect(result.remaining).toBe(99);
	});

	it('decrements remaining on subsequent requests', async () => {
		const id = 'test-user-decrement';
		const result1 = await checkRateLimit(id, 'free');
		const result2 = await checkRateLimit(id, 'free');

		expect(result1.remaining).toBe(99);
		expect(result2.remaining).toBe(98);
	});

	it('rejects when limit is reached', async () => {
		// Use public tier (10 requests) for faster test
		const id = 'test-user-limit';
		for (let i = 0; i < 10; i++) {
			await checkRateLimit(id, 'public');
		}

		const result = await checkRateLimit(id, 'public');
		expect(result.success).toBe(false);
		expect(result.remaining).toBe(0);
	});

	it('uses different counters for different identifiers', async () => {
		const result1 = await checkRateLimit('user-a-isolated', 'public');
		const result2 = await checkRateLimit('user-b-isolated', 'public');

		expect(result1.remaining).toBe(9);
		expect(result2.remaining).toBe(9);
	});

	it('returns reset timestamp in the future', async () => {
		const before = Date.now();
		const result = await checkRateLimit('test-user-reset', 'free');
		expect(result.reset).toBeGreaterThan(before);
	});

	it('applies auth_attempt tier limits correctly', async () => {
		const id = 'test-auth-attempt';
		const result = await checkRateLimit(id, 'auth_attempt');
		expect(result.limit).toBe(20);
		expect(result.remaining).toBe(19);
	});
});
