import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load .env.local manually (Next.js does this at runtime, but prisma CLI doesn't)
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error(
    "[prisma.config] DATABASE_URL is not set. Please set it in .env.local\n" +
    "Example: DATABASE_URL=\"postgres://user:pass@host:port/dbname?schema=public\""
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: dbUrl,
  },
});
