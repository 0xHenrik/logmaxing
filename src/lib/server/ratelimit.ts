import { Redis } from '@upstash/redis';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';
import { Ratelimit } from '@upstash/ratelimit';

// Rate limit tiers (requests per window)
export const RATE_LIMITS = {
	public: { requests: 10, window: '1 d' }, // 10/day for public endpoints (waitlist)
	auth_attempt: { requests: 20, window: '15 m' }, // 20 auth attempts per 15 min per IP
	free: { requests: 100, window: '1 d' }, // 100/day for free tier
	developer: { requests: 170, window: '1 d' }, // ~5000/month
	pro: { requests: 850, window: '1 d' }, // ~25000/month
	enterprise: { requests: 3400, window: '1 d' } // ~100000/month
} as const;

type RateLimitResult = {
	success: boolean;
	limit: number;
	remaining: number;
	reset: number;
};

// In-memory fallback for development (won't persist across serverless restarts)
const memoryStore = new Map<string, { count: number; resetAt: number }>();

// Periodic cleanup of expired in-memory entries to prevent memory leaks
if (!building) {
	setInterval(() => {
		const now = Date.now();
		for (const [key, entry] of memoryStore) {
			if (now > entry.resetAt) memoryStore.delete(key);
		}
	}, 60_000);
}

function getMemoryRateLimit(identifier: string, limit: number, windowMs: number): RateLimitResult {
	const now = Date.now();
	const entry = memoryStore.get(identifier);

	if (!entry || now > entry.resetAt) {
		memoryStore.set(identifier, { count: 1, resetAt: now + windowMs });
		return { success: true, limit, remaining: limit - 1, reset: now + windowMs };
	}

	if (entry.count >= limit) {
		return { success: false, limit, remaining: 0, reset: entry.resetAt };
	}

	entry.count++;
	return { success: true, limit, remaining: limit - entry.count, reset: entry.resetAt };
}

// Create shared Redis client and per-tier limiters at module level (reused across requests)
let redisClient: Redis | null = null;
const tierLimiters = new Map<RateLimitTier, Ratelimit>();

if (!building && env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
	redisClient = new Redis({
		url: env.UPSTASH_REDIS_REST_URL,
		token: env.UPSTASH_REDIS_REST_TOKEN
	});

	for (const [tier, limits] of Object.entries(RATE_LIMITS)) {
		tierLimiters.set(
			tier as RateLimitTier,
			new Ratelimit({
				redis: redisClient,
				limiter: Ratelimit.slidingWindow(limits.requests, limits.window),
				analytics: true,
				prefix: `logmaxing:ratelimit:${tier}`
			})
		);
	}
} else if (!building) {
	console.warn('Rate limiting: Redis not configured, using in-memory fallback');
}

export type RateLimitTier = keyof typeof RATE_LIMITS;

function parseWindowMs(window: string): number {
	const match = window.match(/^(\d+)\s*(d|h|m|s)$/);
	if (!match) return 24 * 60 * 60 * 1000; // default 1 day
	const value = Number(match[1]);
	switch (match[2]) {
		case 'd':
			return value * 24 * 60 * 60 * 1000;
		case 'h':
			return value * 60 * 60 * 1000;
		case 'm':
			return value * 60 * 1000;
		case 's':
			return value * 1000;
		default:
			return 24 * 60 * 60 * 1000;
	}
}

export async function checkRateLimit(
	identifier: string,
	tier: RateLimitTier = 'free'
): Promise<RateLimitResult> {
	const limits = RATE_LIMITS[tier];
	const windowMs = parseWindowMs(limits.window);

	// Use Upstash in production, memory in development
	const limiter = tierLimiters.get(tier);
	if (limiter) {
		const result = await limiter.limit(identifier);
		return {
			success: result.success,
			limit: result.limit,
			remaining: result.remaining,
			reset: result.reset
		};
	}

	// Fallback to in-memory rate limiting (development only)
	return getMemoryRateLimit(identifier, limits.requests, windowMs);
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
	return {
		'X-RateLimit-Limit': String(result.limit),
		'X-RateLimit-Remaining': String(result.remaining),
		'X-RateLimit-Reset': String(result.reset)
	};
}
