import createCuid from '@bugsnag/cuid';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { drink_types } from './drink_types.schema';

// Drink subtypes table (for beers: Rubia, Negra, etc.)
export const drink_subtypes = sqliteTable('drink_subtypes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  drinkTypeId: text('drink_type_id')
    .notNull()
    .references(() => drink_types.id, { onDelete: 'cascade' }),
  name: text('name').notNull().unique(), // e.g., 'Rubia', 'Negra'
  name_es_es: text('name_es_es').notNull(), // Spanish display name
  name_en_gb: text('name_en_gb'), // English display name (optional)
  name_ca_es: text('name_ca_es'), // Catalan display name (optional)
  // JSON translations column for dynamic language support
  translations: text('translations', { mode: 'json' })
    .$type<Record<string, string>>()
    .$defaultFn(() => ({}))
    .notNull(),
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
  name_es_es: (schema) => schema.name_es_es.min(1).max(100),
  name_en_gb: (schema) => schema.name_en_gb.min(1).max(100),
  name_ca_es: (schema) => schema.name_ca_es.min(1).max(100),
  defaultTempConsume: (schema) => schema.defaultTempConsume.min(-10).max(30),
  defaultTempFreeze: (schema) => schema.defaultTempFreeze.min(-20).max(10),
})
  .required({
    drinkTypeId: true,
    name: true,
    name_es_es: true,
    defaultTempConsume: true,
    defaultTempFreeze: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true, translations: true });

export const drinkSubtypeSchemas = {
  select: createSelectSchema(drink_subtypes),
  insert: insertDrinkSubtypeSchema,
  patch: insertDrinkSubtypeSchema.partial(),
} as const;
