import { PrismaClient } from "@prisma/client";

// Safe lazy initialization of PrismaClient so Next.js static build workers never fail module evaluation
export function getPrismaClient(): PrismaClient | null {
  if (!process.env.DATABASE_URL) return null;
  try {
    return new (PrismaClient as any)({
      accelerateUrl: process.env.DATABASE_URL.startsWith("prisma://")
        ? process.env.DATABASE_URL
        : "prisma://accelerate.prisma-data.net/?api_key=mock",
    });
  } catch (e) {
    return null;
  }
}
