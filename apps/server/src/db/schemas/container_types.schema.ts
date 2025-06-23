import createCuid from '@bugsnag/cuid';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const container_types = sqliteTable('container_types', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  name: text('name').notNull().unique(), // Internal name: 'plastic', 'glass', 'metal'
  nameEs: text('name_es').notNull(), // Spanish display name (now first)
  nameEn: text('name_en'), // English display name (optional)
  nameCa: text('name_ca'), // Catalan display name (optional)
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
  nameEn: (schema) => schema.nameEn.min(1).max(100),
  nameEs: (schema) => schema.nameEs.min(1).max(100),
  nameCa: (schema) => schema.nameCa.min(1).max(100),
  thermalConductivity: (schema) => schema.thermalConductivity.min(1).max(100), // Scale of 1-100
})
  .required({
    name: true,
    nameEn: true,
    thermalConductivity: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

export const containerTypeSchemas = {
  select: createSelectSchema(container_types),
  insert: insertContainerTypeSchema,
  patch: insertContainerTypeSchema.partial(),
} as const;
