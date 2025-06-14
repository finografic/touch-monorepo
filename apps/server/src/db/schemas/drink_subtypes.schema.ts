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
  nameEn: text('name_en').notNull(), // English display name
  nameEs: text('name_es'), // Spanish display name (optional)
  nameCat: text('name_cat'), // Catalan display name (optional)
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
  nameEn: (schema) => schema.nameEn.min(1).max(100),
  nameEs: (schema) => schema.nameEs.min(1).max(100),
  nameCat: (schema) => schema.nameCat.min(1).max(100),
  defaultTempConsume: (schema) => schema.defaultTempConsume.min(-10).max(30),
  defaultTempFreeze: (schema) => schema.defaultTempFreeze.min(-20).max(10),
})
  .required({
    drinkTypeId: true,
    name: true,
    nameEn: true,
    defaultTempConsume: true,
    defaultTempFreeze: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

export const drinkSubtypeSchemas = {
  select: createSelectSchema(drink_subtypes),
  insert: insertDrinkSubtypeSchema,
  patch: insertDrinkSubtypeSchema.partial(),
} as const;
