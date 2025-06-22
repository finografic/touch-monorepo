import createCuid from '@bugsnag/cuid';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// Configuration table for entities that need translation columns
export const translatable_entities = sqliteTable('translatable_entities', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  tableName: text('table_name').notNull().unique(), // 'drink_types', 'volumes', etc.
  entityName: text('entity_name').notNull(), // 'Drink Types', 'Volumes'
  description: text('description'), // Optional description for admin
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Zod schemas for validation
const insertTranslatableEntitySchema = createInsertSchema(translatable_entities, {
  tableName: (schema) =>
    schema.tableName
      .min(1)
      .max(50)
      .regex(/^[a-z_]+$/),
  entityName: (schema) => schema.entityName.min(1).max(100),
  description: (schema) => schema.description.max(255),
  sortOrder: (schema) => schema.sortOrder.min(0).max(999),
})
  .required({
    tableName: true,
    entityName: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

export const translatableEntitySchemas = {
  select: createSelectSchema(translatable_entities),
  insert: insertTranslatableEntitySchema,
  patch: insertTranslatableEntitySchema.partial(),
} as const;
