import { NextRequest, NextResponse } from "next/server";

interface RateLimitStore {
  [ip: string]: { count: number; expiresAt: number };
}

const store: RateLimitStore = {};

export function checkRateLimit(req: NextRequest, limit: number = 10, windowMs: number = 60000) {
  // In Next.js App Router, the IP is sometimes in headers
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || "127.0.0.1";

  const now = Date.now();
  const record = store[ip];

  // Clean up expired records occasionally to prevent memory leaks
  if (Math.random() < 0.05) {
    for (const key in store) {
      if (store[key].expiresAt < now) delete store[key];
    }
  }

  if (!record || record.expiresAt < now) {
    store[ip] = { count: 1, expiresAt: now + windowMs };
    return { success: true };
  }

  if (record.count >= limit) {
    return { success: false, retryAfter: Math.ceil((record.expiresAt - now) / 1000) };
  }

  record.count++;
  return { success: true };
}

export function enforceRateLimit(req: NextRequest, limit: number = 10, windowMs: number = 60000) {
  const result = checkRateLimit(req, limit, windowMs);
  if (!result.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(result.retryAfter) } }
    );
  }
  return null; // Null means passed
}
