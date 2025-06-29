import createCuid from '@bugsnag/cuid';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const volumes = sqliteTable('volumes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  name: text('name').notNull().unique(), // Internal key: '25cl', '1l', etc.
  name_es_es: text('name_es_es').notNull(), // Spanish display name
  name_en_gb: text('name_en_gb'), // English display name (optional)
  name_ca_es: text('name_ca_es'), // Catalan display name (optional)
  // JSON translations column for dynamic language support
  translations: text('translations', { mode: 'json' })
    .$type<Record<string, string>>()
    .notNull()
    .default({ 'en-GB': '' }),
  valueInMl: integer('value_in_ml').notNull(), // Normalized to milliliters
  sortOrder: integer('sort_order').notNull(), // For display ordering
  coolingFactor: real('cooling_factor').notNull().default(1), // Multiplier for cooling time

  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Zod schema for validation
const insertVolumeSchema = createInsertSchema(volumes, {
  name: (schema) => schema.name.min(1).max(20),
  name_es_es: (schema) => schema.name_es_es.min(1).max(20),
  name_en_gb: (schema) => schema.name_en_gb.min(1).max(20),
  name_ca_es: (schema) => schema.name_ca_es.min(1).max(20),
  valueInMl: (schema) => schema.valueInMl.min(1).max(5000), // Up to 5L
  sortOrder: (schema) => schema.sortOrder.min(0),
  coolingFactor: (schema) => schema.coolingFactor.min(0.1).max(5), // Reasonable range for multiplier
})
  .required({
    name: true,
    name_es_es: true,
    valueInMl: true,
    sortOrder: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

// Create patch schema that includes translations
const patchVolumeSchema = insertVolumeSchema.partial().extend({
  translations: createSelectSchema(volumes).shape.translations.optional(),
});

export const volumeSchemas = {
  select: createSelectSchema(volumes, {
    translations: (schema) => schema.translations.optional(), // Simplified schema for translations
  }),
  insert: insertVolumeSchema,
  patch: patchVolumeSchema,
} as const;
