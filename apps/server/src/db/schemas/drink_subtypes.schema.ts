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
  name: text('name').notNull(), // e.g., 'Rubia', 'Negra'
  displayName: text('display_name').notNull(), // Localized display name
  consumptionTemp: integer('consumption_temp').notNull(), // Can override parent's default
  freezeTemp: integer('freeze_temp').notNull(), // Can override parent's default

  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Zod schema for validation
const insertDrinkSubtypeSchema = createInsertSchema(drink_subtypes, {
  name: (schema) => schema.name.min(1).max(50),
  displayName: (schema) => schema.displayName.min(1).max(100),
  consumptionTemp: (schema) => schema.consumptionTemp.min(-10).max(30),
  freezeTemp: (schema) => schema.freezeTemp.min(-20).max(10),
})
  .required({
    drinkTypeId: true,
    name: true,
    displayName: true,
    consumptionTemp: true,
    freezeTemp: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

export const drinkSubtypeSchemas = {
  select: createSelectSchema(drink_subtypes),
  insert: insertDrinkSubtypeSchema,
  patch: insertDrinkSubtypeSchema.partial(),
} as const;
