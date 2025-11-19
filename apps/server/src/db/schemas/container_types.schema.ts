import createCuid from '@bugsnag/cuid';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { sqliteBooleanField } from '../../lib/zod.utils';

export const container_types = sqliteTable('container_types', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  name: text('name').notNull().unique(), // Internal name: 'plastic', 'glass', 'metal'
  // JSON translations column for dynamic language support
  translations: text('translations', { mode: 'json' })
    .$type<Record<string, string>>()
    .notNull()
    .default({ 'en-GB': '' }),
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
  thermalConductivity: (schema) => schema.thermalConductivity.min(1).max(100), // Scale of 1-100
  isActive: () => sqliteBooleanField(), // Handle boolean/integer conversion
})
  .required({
    name: true,
    thermalConductivity: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

// Create patch schema that includes translations and handles boolean fields
const patchContainerTypeSchema = insertContainerTypeSchema.partial().extend({
  translations: createSelectSchema(container_types).shape.translations.optional(),
  isActive: sqliteBooleanField().optional(), // Handle boolean/integer conversion for PATCH
});

export const containerTypeSchemas = {
  select: createSelectSchema(container_types, {
    translations: (schema) => schema.translations.optional(), // Simplified schema for translations
  }),
  insert: insertContainerTypeSchema,
  patch: patchContainerTypeSchema,
} as const;
