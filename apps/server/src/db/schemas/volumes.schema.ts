import createCuid from '@bugsnag/cuid';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const volumes = sqliteTable('volumes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  name: text('name').notNull().unique(), // Internal key: '25cl', '1l', etc.
  nameEn: text('name_en').notNull(), // Display format: '25cl', '1 Liter', etc.
  nameEs: text('name_es'), // Spanish display name (optional)
  nameCat: text('name_cat'), // Catalan display name (optional)
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
  nameEn: (schema) => schema.nameEn.min(1).max(20),
  nameEs: (schema) => schema.nameEs.min(1).max(20),
  nameCat: (schema) => schema.nameCat.min(1).max(20),
  valueInMl: (schema) => schema.valueInMl.min(1).max(5000), // Up to 5L
  sortOrder: (schema) => schema.sortOrder.min(0),
  coolingFactor: (schema) => schema.coolingFactor.min(0.1).max(5), // Reasonable range for multiplier
})
  .required({
    name: true,
    nameEn: true,
    valueInMl: true,
    sortOrder: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

export const volumeSchemas = {
  select: createSelectSchema(volumes),
  insert: insertVolumeSchema,
  patch: insertVolumeSchema.partial(),
} as const;
