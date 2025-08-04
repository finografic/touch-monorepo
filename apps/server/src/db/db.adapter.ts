import Database from 'better-sqlite3';
import chalk from 'chalk';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { env } from '../env.server';
import * as schema from './schemas';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// In production, use a relative path to the database
const dbPath =
  process.env.NODE_ENV === 'production'
    ? path.resolve(dirname(fileURLToPath(import.meta.url)), '../data/db/production.sqlite.db')
    : env.DB_PATH;

const sqlite = new Database(dbPath);

if (sqlite.open) {
  console.log('\n✅ Connected to database:', chalk.green(env.DB_NAME));
} else {
  console.error('\n❌ Failed to open database');
}

export const db = drizzle(sqlite, { schema });
// Suppress type-only export warning for script usage
export const sqliteAny = sqlite as any;
