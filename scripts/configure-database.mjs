import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Determine provider
let provider = '';
const args = process.argv.slice(2);
for (const arg of args) {
  if (arg.startsWith('--provider=')) {
    provider = arg.split('=')[1];
  }
}

// Fallback to env variable
if (!provider) {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');

    // 1. Check DATABASE_PROVIDER first (explicit override)
    const providerLine = envContent.split('\n').find(line => line.startsWith('DATABASE_PROVIDER='));
    if (providerLine) {
      provider = providerLine.split('=')[1].replace(/['"]/g, '').trim();
    }

    // 2. Fall back to auto-detect from DATABASE_URL
    if (!provider) {
      const dbUrlLine = envContent.split('\n').find(line => line.startsWith('DATABASE_URL='));
      if (dbUrlLine) {
        const dbUrl = dbUrlLine.split('=').slice(1).join('=').replace(/['"]/g, '').trim();
        if (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')) {
          provider = 'postgresql';
        } else if (dbUrl.startsWith('file:') || dbUrl.endsWith('.db')) {
          provider = 'sqlite';
        } else if (dbUrl.startsWith('libsql://')) {
          provider = 'sqlite'; // Prisma uses sqlite provider for Turso/libsql
        }
      }
    }
  }
}

// Default to sqlite if not found
if (!provider) {
  provider = 'sqlite';
}

console.log(`[DB Configure] Target database provider: ${provider}`);

// 2. Rewrite schema.prisma datasource provider
const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
if (fs.existsSync(schemaPath)) {
  let schemaContent = fs.readFileSync(schemaPath, 'utf8');
  
  // Replace:
  // datasource db {
  //   provider = "..."
  // }
  const datasourceRegex = /(datasource\s+db\s*{[\s\S]*?provider\s*=\s*")([^"]+)("[[\s\S]*?})/g;
  if (datasourceRegex.test(schemaContent)) {
    schemaContent = schemaContent.replace(datasourceRegex, `$1${provider}$3`);
    fs.writeFileSync(schemaPath, schemaContent, 'utf8');
    console.log(`[DB Configure] Updated schema.prisma provider to: "${provider}"`);
  } else {
    // Try simpler match if formatting differs
    const simpleRegex = /provider\s*=\s*"[^"]+"/;
    if (simpleRegex.test(schemaContent)) {
      schemaContent = schemaContent.replace(simpleRegex, `provider = "${provider}"`);
      fs.writeFileSync(schemaPath, schemaContent, 'utf8');
      console.log(`[DB Configure] Updated provider using fallback match to: "${provider}"`);
    } else {
      console.warn(`[DB Configure] Could not find datasource provider in schema.prisma`);
    }
  }
} else {
  console.error(`[DB Configure] schema.prisma not found at ${schemaPath}`);
}

// 3. Run prisma generate to update client files
try {
  console.log(`[DB Configure] Running prisma generate...`);
  execSync('npx prisma generate', { stdio: 'inherit' });
} catch (e) {
  console.error('[DB Configure] prisma generate failed:', e.message);
}
