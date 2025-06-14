import createCuid from '@bugsnag/cuid';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// Main drink types table
export const drink_types = sqliteTable('drink_types', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  name: text('name').notNull().unique(), // e.g., 'Cerveza', 'Vino', 'Licor', etc.
  nameEn: text('name_en').notNull(), // English display name
  nameEs: text('name_es'), // Spanish display name (optional)
  nameCat: text('name_cat'), // Catalan display name (optional)
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
  nameEn: (schema) => schema.name_en.min(1).max(100),
  nameEs: (schema) => schema.name_es.min(1).max(100),
  nameCat: (schema) => schema.name_cat.min(1).max(100),
  defaultTempConsume: (schema) => schema.defaultTempConsume.min(-10).max(30),
  defaultTempFreeze: (schema) => schema.defaultTempFreeze.min(-20).max(10),
})
  .required({
    name: true,
    nameEn: true,
    defaultTempConsume: true,
    defaultTempFreeze: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

export const drinkTypeSchemas = {
  select: createSelectSchema(drink_types),
  insert: insertDrinkTypeSchema,
  patch: insertDrinkTypeSchema.partial(),
} as const;
