import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ---------------------------------------------------------------------------
// Redis client for rate limiting (separate from cache for clarity)
// ---------------------------------------------------------------------------

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  redis = new Redis({ url, token });
  return redis;
}

// ---------------------------------------------------------------------------
// Rate limit check result
// ---------------------------------------------------------------------------

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

const PASS_RESULT: RateLimitResult = {
  success: true,
  limit: 0,
  remaining: 0,
  reset: 0,
};

// ---------------------------------------------------------------------------
// Lazy-initialized rate limiters
// ---------------------------------------------------------------------------

let chartLimiter: Ratelimit | null = null;
let readingLimiter: Ratelimit | null = null;
let compatibilityLimiter: Ratelimit | null = null;

function getChartLimiter(): Ratelimit | null {
  if (chartLimiter) return chartLimiter;
  const client = getRedis();
  if (!client) return null;

  chartLimiter = new Ratelimit({
    redis: client,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    prefix: 'rl:chart',
  });
  return chartLimiter;
}

function getReadingLimiter(): Ratelimit | null {
  if (readingLimiter) return readingLimiter;
  const client = getRedis();
  if (!client) return null;

  readingLimiter = new Ratelimit({
    redis: client,
    limiter: Ratelimit.slidingWindow(3, '24 h'),
    prefix: 'rl:reading',
  });
  return readingLimiter;
}

function getCompatibilityLimiter(): Ratelimit | null {
  if (compatibilityLimiter) return compatibilityLimiter;
  const client = getRedis();
  if (!client) return null;

  compatibilityLimiter = new Ratelimit({
    redis: client,
    limiter: Ratelimit.slidingWindow(1, '1 h'),
    prefix: 'rl:compat',
  });
  return compatibilityLimiter;
}

// ---------------------------------------------------------------------------
// Public rate check functions
// ---------------------------------------------------------------------------

async function checkLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<RateLimitResult> {
  if (!limiter) return PASS_RESULT;

  try {
    const result = await limiter.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch {
    // If rate limiting fails, allow the request through
    console.warn('[rate-limiter] Check failed, allowing request');
    return PASS_RESULT;
  }
}

export async function checkChartRateLimit(ip: string): Promise<RateLimitResult> {
  return checkLimit(getChartLimiter(), ip);
}

export async function checkReadingRateLimit(userId: string): Promise<RateLimitResult> {
  return checkLimit(getReadingLimiter(), userId);
}

export async function checkCompatibilityRateLimit(ip: string): Promise<RateLimitResult> {
  return checkLimit(getCompatibilityLimiter(), ip);
}
