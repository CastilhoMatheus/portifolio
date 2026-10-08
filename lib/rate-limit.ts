import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/** Per visitor: 2 messages every 30 minutes. */
export const CONTACT_LIMIT = { max: 2, window: "30 m" } as const;
/** Across everyone: protects Resend's free quota (100 emails/day). */
const DAILY_CAP = 50;

// The Vercel Marketplace integration may name these either way
const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

const perVisitor = redis
  ? new Ratelimit({
      redis,
      prefix: "contact:visitor",
      limiter: Ratelimit.slidingWindow(CONTACT_LIMIT.max, CONTACT_LIMIT.window),
    })
  : null;

const daily = redis
  ? new Ratelimit({
      redis,
      prefix: "contact:daily",
      limiter: Ratelimit.fixedWindow(DAILY_CAP, "1 d"),
    })
  : null;

export type LimitResult =
  { ok: true } | { ok: false; reason: "visitor" | "daily"; retryAt: number };

/**
 * Count one contact message for this visitor, identified several ways
 * (e.g. IP and sender email) so changing just one doesn't get around the limit.
 * Without Upstash configured (e.g. local dev) every message is allowed.
 */
export async function limitContact(visitorIds: string[]): Promise<LimitResult> {
  if (!perVisitor || !daily) {
    if (process.env.NODE_ENV === "production") {
      console.warn("Contact form: Upstash not configured, rate limit is off");
    }
    return { ok: true };
  }

  const results = await Promise.all(
    visitorIds.map((id) => perVisitor.limit(id)),
  );
  const blocked = results.filter((r) => !r.success);
  if (blocked.length > 0) {
    const retryAt = Math.max(...blocked.map((r) => r.reset));
    return { ok: false, reason: "visitor", retryAt };
  }

  const global = await daily.limit("all");
  if (!global.success) {
    return { ok: false, reason: "daily", retryAt: global.reset };
  }

  return { ok: true };
}
