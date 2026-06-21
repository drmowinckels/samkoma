import { env } from "cloudflare:test";
import { describe, it, expect } from "vitest";
import { rateLimit, purgeRateLimits } from "../src/ratelimit";

const W1 = 1_000_000_000_000; // fixed timestamp -> stable window bucket

describe("rateLimit", () => {
  it("allows up to the limit then blocks within a window", async () => {
    expect(await rateLimit(env.DB, "a", 3, 60, W1)).toBe(true);
    expect(await rateLimit(env.DB, "a", 3, 60, W1)).toBe(true);
    expect(await rateLimit(env.DB, "a", 3, 60, W1)).toBe(true);
    expect(await rateLimit(env.DB, "a", 3, 60, W1)).toBe(false);
  });

  it("resets in the next window and tracks keys independently", async () => {
    expect(await rateLimit(env.DB, "b", 1, 60, W1)).toBe(true);
    expect(await rateLimit(env.DB, "b", 1, 60, W1)).toBe(false);
    expect(await rateLimit(env.DB, "b", 1, 60, W1 + 60_000)).toBe(true);
    expect(await rateLimit(env.DB, "c", 1, 60, W1)).toBe(true);
  });

  it("purges counters from old windows", async () => {
    await rateLimit(env.DB, "d", 5, 60, 60_000); // bucket 1
    await purgeRateLimits(env.DB, 60, 10 * 60_000); // now bucket 10, purge < 8
    const left = await env.DB.prepare(
      `SELECT COUNT(*) AS c FROM rate_limits`,
    ).first<{ c: number }>();
    expect(left?.c).toBe(0);
  });
});
