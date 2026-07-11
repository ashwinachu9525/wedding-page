import { getPrismaClient } from "./prisma";

/**
 * Log an outbound email attempt (success or failure) to the email_logs table.
 * Designed to be fire-and-forget — never throws.
 */
export async function logEmail(params: {
  to: string;
  subject: string;
  source: string; // "register" | "welcome" | "invitation" | "order" | "payment"
  status: "SUCCESS" | "FAILED";
  error?: string;
}) {
  try {
    const prisma = getPrismaClient();
    if (!prisma) return;

    // Self-healing: create table if it doesn't exist
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS email_logs (
        id TEXT PRIMARY KEY,
        "to" TEXT NOT NULL,
        subject TEXT NOT NULL,
        source TEXT NOT NULL,
        status TEXT NOT NULL,
        error TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    const id = `eml_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    await prisma.$executeRawUnsafe(
      `INSERT INTO email_logs (id, "to", subject, source, status, error, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      id,
      params.to,
      params.subject.substring(0, 500),
      params.source,
      params.status,
      params.error?.substring(0, 1000) || null
    );
  } catch (err) {
    // Never let logging break the main flow
    console.warn("[EmailLog] Failed to persist email log:", err);
  }
}
