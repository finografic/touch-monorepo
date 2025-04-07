// NOTE: AUTH SCHEMAS
// https://www.better-auth.com/docs/concepts/database#core-schema
export * from './auth_account.schema';
export * from './auth_session.schema';
export * from './auth_user.schema';
export * from './auth_verification.schema';

// NOTE: REFERENCE SCHEMA (for future development)
export * from './posts.schema';

// NOTE: DRINK CONTROL SYSTEM SCHEMAS
// Core schemas
export * from './temperature_tables.schema';
export * from './elements.schema';
export * from './running_orders.schema';

// Configuration schemas
export * from './drink_configs.schema';
export * from './drink_types.schema';
export * from './container_types.schema';
export * from './volumes.schema';

import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Types table
export const drink_types = sqliteTable('drink_types', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  display_name: text('display_name').notNull(),
  has_subtypes: integer('has_subtypes').notNull(),
  default_consumption_time: integer('default_consumption_time').notNull(),
  default_freeze_temp: integer('default_freeze_temp').notNull(),
  is_active: integer('is_active').notNull(),
  created_at: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// Subtypes table
export const drink_subtypes = sqliteTable('drink_subtypes', {
  id: text('id').primaryKey(),
  drink_type_id: text('drink_type_id')
    .notNull()
    .references(() => drink_types.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  display_name: text('display_name').notNull(),
  is_active: integer('is_active').notNull(),
  created_at: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// Configs table
export const drink_configs = sqliteTable('drink_configs', {
  id: text('id').primaryKey(),
  drink_type_id: text('drink_type_id')
    .notNull()
    .references(() => drink_types.id),
  drink_subtype_id: text('drink_subtype_id').references(() => drink_subtypes.id),
  container_type_id: text('container_type_id')
    .notNull()
    .references(() => container_types.id),
  volume_id: text('volume_id')
    .notNull()
    .references(() => volumes.id),
  consumption_time: integer('consumption_time').notNull(),
  freeze_temp: integer('freeze_temp').notNull(),
  is_active: integer('is_active').notNull(),
  created_at: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
