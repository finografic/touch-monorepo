import type { Config } from 'drizzle-kit';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schemas/*.schema.ts', // Relative to server root
  out: '../../data/migrations', // Up to project root
  dialect: 'sqlite',
  dbCredentials: {
    url: '../../data/development.sqlite.db', // Up to project root
  },
  verbose: true,
  strict: true,
}) satisfies Config;
