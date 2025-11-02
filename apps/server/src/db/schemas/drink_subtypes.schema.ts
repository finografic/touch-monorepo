import createCuid from '@bugsnag/cuid';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { drink_types } from './drink_types.schema';
import { sqliteBooleanField } from '../../lib/zod.utils';

// Drink subtypes table (for beers: Rubia, Negra, etc.)
export const drink_subtypes = sqliteTable('drink_subtypes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  drinkTypeId: text('drink_type_id')
    .notNull()
    .references(() => drink_types.id, { onDelete: 'cascade' }),
  name: text('name').notNull().unique(), // e.g., 'Rubia', 'Negra'
  // JSON translations column for dynamic language support
  translations: text('translations', { mode: 'json' })
    .$type<Record<string, string>>()
    .notNull()
    .default({ 'en-GB': '' }),
  defaultTempConsume: integer('default_temp_consume').notNull(), // Can override parent's default
  defaultTempFreeze: integer('default_temp_freeze').notNull(), // Can override parent's default

  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Zod schema for validation
const insertDrinkSubtypeSchema = createInsertSchema(drink_subtypes, {
  name: (schema) => schema.name.min(1).max(50),
  defaultTempConsume: (schema) => schema.defaultTempConsume.min(-10).max(30),
  defaultTempFreeze: (schema) => schema.defaultTempFreeze.min(-20).max(10),
  isActive: () => sqliteBooleanField(), // Handle boolean/integer conversion
})
  .required({
    drinkTypeId: true,
    name: true,
    defaultTempConsume: true,
    defaultTempFreeze: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

// Create patch schema that includes translations and handles boolean fields
const patchDrinkSubtypeSchema = insertDrinkSubtypeSchema.partial().extend({
  translations: createSelectSchema(drink_subtypes).shape.translations.optional(),
  isActive: sqliteBooleanField().optional(), // Handle boolean/integer conversion for PATCH
});

export const drinkSubtypeSchemas = {
  select: createSelectSchema(drink_subtypes, {
    translations: (schema) => schema.translations.optional(), // Simplified schema for translations
  }),
  insert: insertDrinkSubtypeSchema,
  patch: patchDrinkSubtypeSchema,
} as const;
