import { Redis } from '@upstash/redis';
import type { ChartAnalysis } from '@/engine/types';

// ---------------------------------------------------------------------------
// Redis client (lazy-initialized, graceful degradation)
// ---------------------------------------------------------------------------

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  redis = new Redis({ url, token });
  return redis;
}

// ---------------------------------------------------------------------------
// TTL constants (seconds)
// ---------------------------------------------------------------------------

const TTL = {
  chart: 604800,       // 7 days
  reading: 2592000,    // 30 days
  dailyEnergy: 90000,  // ~25 hours (overlap to ensure coverage)
} as const;

// ---------------------------------------------------------------------------
// Chart caching
// ---------------------------------------------------------------------------

export async function getCachedChart(profileId: string): Promise<ChartAnalysis | null> {
  const client = getRedis();
  if (!client) return null;

  try {
    const data = await client.get<ChartAnalysis>(`chart:${profileId}`);
    return data ?? null;
  } catch {
    console.warn('[cache] Failed to get cached chart');
    return null;
  }
}

export async function cacheChart(
  profileId: string,
  chart: ChartAnalysis,
  ttl: number = TTL.chart
): Promise<void> {
  const client = getRedis();
  if (!client) return;

  try {
    await client.set(`chart:${profileId}`, chart, { ex: ttl });
  } catch {
    console.warn('[cache] Failed to cache chart');
  }
}

export async function invalidateChart(profileId: string): Promise<void> {
  const client = getRedis();
  if (!client) return;

  try {
    await client.del(`chart:${profileId}`);
  } catch {
    console.warn('[cache] Failed to invalidate chart');
  }
}

// ---------------------------------------------------------------------------
// Reading caching
// ---------------------------------------------------------------------------

export function generateReadingCacheKey(
  chartId: string,
  readingType: string,
  language: string,
  targetYear?: number
): string {
  const parts = ['reading', chartId, readingType, language];
  if (targetYear !== undefined) {
    parts.push(String(targetYear));
  }
  return parts.join(':');
}

export async function getCachedReading(key: string): Promise<string | null> {
  const client = getRedis();
  if (!client) return null;

  try {
    const data = await client.get<string>(key);
    return data ?? null;
  } catch {
    console.warn('[cache] Failed to get cached reading');
    return null;
  }
}

export async function cacheReading(
  key: string,
  reading: string,
  ttl: number = TTL.reading
): Promise<void> {
  const client = getRedis();
  if (!client) return;

  try {
    await client.set(key, reading, { ex: ttl });
  } catch {
    console.warn('[cache] Failed to cache reading');
  }
}

// ---------------------------------------------------------------------------
// Daily energy caching
// ---------------------------------------------------------------------------

interface DailyEnergyCache {
  stemIndex: number;
  branchIndex: number;
  elementHighlights: Record<string, unknown>;
}

export async function getCachedDailyEnergy(date: string): Promise<DailyEnergyCache | null> {
  const client = getRedis();
  if (!client) return null;

  try {
    const data = await client.get<DailyEnergyCache>(`daily:${date}`);
    return data ?? null;
  } catch {
    console.warn('[cache] Failed to get cached daily energy');
    return null;
  }
}

export async function cacheDailyEnergy(
  date: string,
  data: DailyEnergyCache,
  ttl: number = TTL.dailyEnergy
): Promise<void> {
  const client = getRedis();
  if (!client) return;

  try {
    await client.set(`daily:${date}`, data, { ex: ttl });
  } catch {
    console.warn('[cache] Failed to cache daily energy');
  }
}
