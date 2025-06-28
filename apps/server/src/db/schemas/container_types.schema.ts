import createCuid from '@bugsnag/cuid';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const container_types = sqliteTable('container_types', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  name: text('name').notNull().unique(), // Internal name: 'plastic', 'glass', 'metal'
  name_es_es: text('name_es_es').notNull(), // Spanish display name
  name_en_gb: text('name_en_gb'), // English display name (optional)
  name_ca_es: text('name_ca_es'), // Catalan display name (optional)
  // JSON translations column for dynamic language support
  translations: text('translations', { mode: 'json' })
    .$type<Record<string, string>>()
    .$defaultFn(() => ({}))
    .notNull(),
  thermalConductivity: integer('thermal_conductivity').notNull(), // Affects cooling time

  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Zod schema for validation
const insertContainerTypeSchema = createInsertSchema(container_types, {
  name: (schema) => schema.name.min(1).max(50),
  name_es_es: (schema) => schema.name_es_es.min(1).max(100),
  name_en_gb: (schema) => schema.name_en_gb.min(1).max(100),
  name_ca_es: (schema) => schema.name_ca_es.min(1).max(100),
  thermalConductivity: (schema) => schema.thermalConductivity.min(1).max(100), // Scale of 1-100
})
  .required({
    name: true,
    name_es_es: true,
    thermalConductivity: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true, translations: true });

export const containerTypeSchemas = {
  select: createSelectSchema(container_types),
  insert: insertContainerTypeSchema,
  patch: insertContainerTypeSchema.partial(),
} as const;
