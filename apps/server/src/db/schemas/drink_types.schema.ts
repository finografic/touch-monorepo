import createCuid from '@bugsnag/cuid';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// Main drink types table
export const drink_types = sqliteTable('drink_types', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  name: text('name').notNull().unique(), // e.g., 'Cerveza', 'Vino', 'Licor', etc.
  name_es_es: text('name_es_es').notNull(), // Spanish display name
  name_en_gb: text('name_en_gb'), // English display name (optional)
  name_ca_es: text('name_ca_es'), // Catalan display name (optional)
  // JSON translations column for dynamic language support
  translations: text('translations', { mode: 'json' })
    .$type<Record<string, string>>()
    .$defaultFn(() => ({}))
    .notNull(),
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
  name_es_es: (schema) => schema.name_es_es.min(1).max(100),
  name_en_gb: (schema) => schema.name_en_gb.min(1).max(100),
  name_ca_es: (schema) => schema.name_ca_es.min(1).max(100),
  defaultTempConsume: (schema) => schema.defaultTempConsume.min(-10).max(30),
  defaultTempFreeze: (schema) => schema.defaultTempFreeze.min(-20).max(10),
})
  .required({
    name: true,
    name_es_es: true,
    defaultTempConsume: true,
    defaultTempFreeze: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true, translations: true });

export const drinkTypeSchemas = {
  select: createSelectSchema(drink_types),
  insert: insertDrinkTypeSchema,
  patch: insertDrinkTypeSchema.partial(),
} as const;
