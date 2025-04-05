import createCuid from '@bugsnag/cuid';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const containerTypes = sqliteTable('container_types', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  name: text('name').notNull(), // Internal name: 'plastic', 'glass', 'metal'
  displayName: text('display_name').notNull(), // Localized: 'Plástico', 'Vidrio', 'Metal'
  thermalConductivity: integer('thermal_conductivity').notNull(), // Affects cooling time

  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Zod schema for validation
const insertContainerTypeSchema = createInsertSchema(containerTypes, {
  name: (schema) => schema.name.min(1).max(50),
  displayName: (schema) => schema.displayName.min(1).max(100),
  thermalConductivity: (schema) => schema.thermalConductivity.min(1).max(100), // Scale of 1-100
})
  .required({
    name: true,
    displayName: true,
    thermalConductivity: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

export const containerTypeSchemas = {
  select: createSelectSchema(containerTypes),
  insert: insertContainerTypeSchema,
  patch: insertContainerTypeSchema.partial(),
} as const;
