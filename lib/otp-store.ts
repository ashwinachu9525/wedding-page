/**
 * Shared in-memory OTP store.
 * Both /api/auth/register and /api/auth/verify-otp import from here
 * so they share the same Map instance within the same server process.
 *
 * Note: This works for single-instance deployments (local dev, single Vercel
 * function). For multi-instance / edge deployments, replace with Redis.
 */

interface OtpEntry {
  otp: string;
  expiresAt: number;
}

// Use globalThis so hot-reload in dev doesn't reset the store
const g = globalThis as unknown as { __otpStore?: Map<string, OtpEntry> };
if (!g.__otpStore) {
  g.__otpStore = new Map<string, OtpEntry>();
}

export const otpStore: Map<string, OtpEntry> = g.__otpStore;

export function storeOtp(email: string, otp: string): void {
  otpStore.set(email.toLowerCase(), {
    otp,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
  });
}

export function verifyAndConsumeOtp(email: string, otp: string): "valid" | "invalid" | "expired" | "not_found" {
  const entry = otpStore.get(email.toLowerCase());
  if (!entry) return "not_found";
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return "expired";
  }
  if (otp.trim() !== entry.otp) return "invalid";
  otpStore.delete(email.toLowerCase()); // consume — one-time use
  return "valid";
}
