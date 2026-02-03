import { Redis } from '@upstash/redis';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';
import { Ratelimit } from '@upstash/ratelimit';

// Rate limit tiers (requests per window)
export const RATE_LIMITS = {
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

// In-memory fallback for development (won't persist across restarts)
const memoryStore = new Map<string, { count: number; resetAt: number }>();

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

// Create Upstash ratelimiter if credentials exist
let upstashRatelimit: Ratelimit | null = null;

if (!building && env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
	const redis = new Redis({
		url: env.UPSTASH_REDIS_REST_URL,
		token: env.UPSTASH_REDIS_REST_TOKEN
	});

	upstashRatelimit = new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(RATE_LIMITS.free.requests, RATE_LIMITS.free.window),
		analytics: true,
		prefix: 'logmaxing:ratelimit'
	});
}

export type RateLimitTier = keyof typeof RATE_LIMITS;

export async function checkRateLimit(
	identifier: string,
	tier: RateLimitTier = 'free'
): Promise<RateLimitResult> {
	const limits = RATE_LIMITS[tier];
	const windowMs = 24 * 60 * 60 * 1000; // 1 day

	// Use Upstash in production, memory in development
	if (upstashRatelimit) {
		// Create a tier-specific limiter for accurate limits
		const tierLimiter = new Ratelimit({
			redis: new Redis({
				url: env.UPSTASH_REDIS_REST_URL!,
				token: env.UPSTASH_REDIS_REST_TOKEN!
			}),
			limiter: Ratelimit.slidingWindow(limits.requests, limits.window),
			analytics: true,
			prefix: `logmaxing:ratelimit:${tier}`
		});

		const result = await tierLimiter.limit(identifier);
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
