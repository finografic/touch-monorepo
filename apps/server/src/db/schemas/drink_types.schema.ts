import {
  TEMP_CONSUME_SCHEMA_MAX,
  TEMP_CONSUME_SCHEMA_MIN,
  TEMP_FREEZE_SCHEMA_MAX,
  TEMP_FREEZE_SCHEMA_MIN,
} from '@workspace/shared/constants';

import createCuid from '@bugsnag/cuid';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { sqliteBooleanField } from '../../lib/zod.utils';

// Main drink types table
export const drink_types = sqliteTable('drink_types', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  name: text('name').notNull().unique(), // e.g., 'Cerveza', 'Vino', 'Licor', etc.
  // JSON translations column for dynamic language support
  translations: text('translatSSions', { mode: 'json' })
    .$type<Record<string, string>>()
    .notNull()
    .default({ 'en-GB': '' }),
  hasSubtypes: integer('has_subtypes', { mode: 'boolean' }).notNull().default(false),
  defaultTempConsume: integer('default_temp_consume').notNull(), // in Celsius
  defaultTempFreeze: integer('default_temp_freeze').notNull(), // in Celsius
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Zod schemas for validation
const insertDrinkTypeSchema = createInsertSchema(drink_types, {
  name: (schema) => schema.name.min(1).max(50),
  defaultTempConsume: (schema) =>
    schema.defaultTempConsume.min(TEMP_CONSUME_SCHEMA_MIN).max(TEMP_CONSUME_SCHEMA_MAX),
  defaultTempFreeze: (schema) =>
    schema.defaultTempFreeze.min(TEMP_FREEZE_SCHEMA_MIN).max(TEMP_FREEZE_SCHEMA_MAX),
  hasSubtypes: () => sqliteBooleanField(), // Handle boolean/integer conversion
  isActive: () => sqliteBooleanField(), // Handle boolean/integer conversion
})
  .required({
    name: true,
    defaultTempConsume: true,
    defaultTempFreeze: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

// Create patch schema that includes translations and handles boolean fields
const patchDrinkTypeSchema = insertDrinkTypeSchema.partial().extend({
  translations: createSelectSchema(drink_types).shape.translations.optional(),
  hasSubtypes: sqliteBooleanField().optional(), // Handle boolean/integer conversion for PATCH
  isActive: sqliteBooleanField().optional(), // Handle boolean/integer conversion for PATCH
});

export const drinkTypeSchemas = {
  select: createSelectSchema(drink_types, {
    translations: (schema) => schema.translations.optional(), // Simplified schema for translations
  }),
  insert: insertDrinkTypeSchema,
  patch: patchDrinkTypeSchema,
} as const;
