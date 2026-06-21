export function currentBucket(windowSec: number, now = Date.now()): number {
  return Math.floor(now / 1000 / windowSec);
}

// Fixed-window limiter backed by D1. Returns true if the request is allowed.
// Fails open: a limiter error must never block legitimate traffic.
export async function rateLimit(
  db: D1Database,
  key: string,
  limit: number,
  windowSec: number,
  now = Date.now(),
): Promise<boolean> {
  const bucket = currentBucket(windowSec, now);
  try {
    const row = await db
      .prepare(
        `INSERT INTO rate_limits (k, count, bucket) VALUES (?, 1, ?)
         ON CONFLICT(k) DO UPDATE SET count = count + 1
         RETURNING count`,
      )
      .bind(`${key}:${bucket}`, bucket)
      .first<{ count: number }>();
    return (row?.count ?? 1) <= limit;
  } catch {
    return true;
  }
}

// Drop counters from windows that are no longer relevant.
export async function purgeRateLimits(
  db: D1Database,
  windowSec: number,
  now = Date.now(),
): Promise<void> {
  await db
    .prepare(`DELETE FROM rate_limits WHERE bucket < ?`)
    .bind(currentBucket(windowSec, now) - 2)
    .run();
}
