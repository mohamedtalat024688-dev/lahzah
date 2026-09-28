// src/lib/rateLimit.ts - In-memory sliding-window rate limiter
// Suitable for single-instance Next.js servers; pluggable for Redis/Upstash in multi-instance production.

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  windowMs: number; // Window size in milliseconds
  max: number;      // Maximum requests allowed in the window
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { windowMs: 60 * 1000, max: 30 }
): { success: boolean; limit: number; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + options.windowMs,
    };
    rateLimitStore.set(identifier, newRecord);
    return {
      success: true,
      limit: options.max,
      remaining: options.max - 1,
      resetTime: newRecord.resetTime,
    };
  }

  if (record.count >= options.max) {
    return {
      success: false,
      limit: options.max,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count += 1;
  return {
    success: true,
    limit: options.max,
    remaining: options.max - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Extracts client IP safely from standard headers
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}
