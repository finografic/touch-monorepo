import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * App-level configuration key/value store.
 * Each row is one config entry: name (key), is_active, and optional JSON data.
 */
export const app_configuration = sqliteTable('app_configuration', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(false),
  data: text('data').default('{}'), // JSON object for config-specific shape
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export type AppConfiguration = typeof app_configuration.$inferSelect;
export type NewAppConfiguration = typeof app_configuration.$inferInsert;
