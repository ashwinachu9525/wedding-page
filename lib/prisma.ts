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
        const schemaName = urlObj.searchParams.get("schema") || "public";
        urlObj.searchParams.delete("sslmode");
        const cleanUrl = urlObj.toString();

        const pool = new Pool({
          connectionString: cleanUrl,
          ssl: {
            rejectUnauthorized: false,
          },
          options: `-c search_path=${schemaName}`,
        });
        const adapter = new PrismaPg(pool, { schema: schemaName });
        globalForPrisma.prisma = new PrismaClient({ adapter });
        console.log("[Prisma Client] Initialized with PostgreSQL driver adapter.");
      } else if (dbUrl.startsWith("libsql://")) {
        const { PrismaLibSQL } = require("@prisma/adapter-libsql");
        const { createClient } = require("@libsql/client");

        const client = createClient({
          url: dbUrl,
          authToken: process.env.LIBSQL_AUTH_TOKEN,
        });
        const adapter = new PrismaLibSQL(client);
        globalForPrisma.prisma = new PrismaClient({ adapter });
        console.log("[Prisma Client] Initialized with LibSQL/Turso driver adapter.");
      } else if (dbUrl.startsWith("file:") || dbUrl.endsWith(".db")) {
        const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
        const Database = require("better-sqlite3");

        const filename = dbUrl.replace("file:", "");
        const db = new Database(filename);
        const adapter = new PrismaBetterSqlite3(db);
        globalForPrisma.prisma = new PrismaClient({ adapter });
        console.log(`[Prisma Client] Initialized with SQLite driver adapter (${filename}).`);
      } else {
        // Fallback to standard PrismaClient without adapter
        globalForPrisma.prisma = new PrismaClient();
        console.log("[Prisma Client] Initialized default client.");
      }
    }
    return globalForPrisma.prisma;
  } catch (e) {
    console.error("PrismaClient initialization failed:", e);
    return null;
  }
}
