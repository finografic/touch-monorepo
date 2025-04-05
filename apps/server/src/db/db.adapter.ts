import Database from 'better-sqlite3';
import chalk from 'chalk';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { env } from '../env.server';
import * as schema from './schemas';

const sqlite = new Database(env.DB_PATH);

if (sqlite.open) {
  console.log('\n ✅  Connected to database:', chalk.green(env.DB_NAME));
} else {
  console.error('\n ❌  Failed to open database');
}

export const db = drizzle(sqlite, { schema });
