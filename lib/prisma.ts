import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export function getPrismaClient(): PrismaClient | null {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return null;

  try {
    if (!globalForPrisma.prisma) {
      if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
        const { PrismaPg } = require("@prisma/adapter-pg");
        const { Pool } = require("pg");

        const urlObj = new URL(dbUrl);

        // Extract schema before stripping all query params
        const schemaName = urlObj.searchParams.get("schema") || "public";

        // Build a clean connection string with ONLY the SSL param pg understands
        // Remove all custom params (schema, sslmode, etc.) that confuse pg.Pool
        const cleanUrlObj = new URL(dbUrl);
        cleanUrlObj.search = ""; // strip all query params
        const cleanUrl = cleanUrlObj.toString();

        const pool = new Pool({
          connectionString: cleanUrl,
          ssl: { rejectUnauthorized: false },
          // Set schema via session options
          options: `-c search_path=${schemaName},public`,
        });

        const adapter = new PrismaPg(pool, { schema: schemaName });
        globalForPrisma.prisma = new PrismaClient({ adapter });
        console.log(`[Prisma] Initialized PostgreSQL adapter (schema: ${schemaName})`);
      } else if (dbUrl.startsWith("libsql://")) {
        const { PrismaLibSQL } = require("@prisma/adapter-libsql");
        const { createClient } = require("@libsql/client");

        const client = createClient({
          url: dbUrl,
          authToken: process.env.LIBSQL_AUTH_TOKEN,
        });
        const adapter = new PrismaLibSQL(client);
        globalForPrisma.prisma = new PrismaClient({ adapter });
        console.log("[Prisma] Initialized LibSQL/Turso adapter.");
      } else if (dbUrl.startsWith("file:") || dbUrl.endsWith(".db")) {
        const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
        const Database = require("better-sqlite3");

        const filename = dbUrl.replace("file:", "");
        const db = new Database(filename);
        const adapter = new PrismaBetterSqlite3(db);
        globalForPrisma.prisma = new PrismaClient({ adapter });
        console.log(`[Prisma] Initialized SQLite adapter (${filename}).`);
      } else {
        globalForPrisma.prisma = new PrismaClient();
        console.log("[Prisma] Initialized default client.");
      }
    }
    return globalForPrisma.prisma;
  } catch (e) {
    console.error("[Prisma] Client initialization failed:", e);
    // Reset so next request retries initialization
    globalForPrisma.prisma = undefined;
    return null;
  }
}
