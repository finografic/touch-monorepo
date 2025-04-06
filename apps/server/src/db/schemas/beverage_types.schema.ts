import createCuid from '@bugsnag/cuid';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// Main beverage types table
export const beverage_types = sqliteTable('beverage_types', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  name: text('name').notNull(), // e.g., 'Cerveza', 'Vino', 'Licor', etc.
  displayName: text('display_name').notNull(), // Localized display name
  hasSubtypes: integer('has_subtypes', { mode: 'boolean' }).notNull().default(false),
  defaultConsumptionTemp: integer('default_consumption_temp').notNull(), // in Celsius
  defaultFreezeTemp: integer('default_freeze_temp').notNull(), // in Celsius

  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Beverage subtypes table (for beers: Rubia, Negra, etc.)
export const beverage_subtypes = sqliteTable('beverage_subtypes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  beverageTypeId: text('beverage_type_id')
    .notNull()
    .references(() => beverage_types.id, { onDelete: 'cascade' }),
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

// Zod schemas for validation
const insertBeverageTypeSchema = createInsertSchema(beverage_types, {
  name: (schema) => schema.name.min(1).max(50),
  displayName: (schema) => schema.displayName.min(1).max(100),
  defaultConsumptionTemp: (schema) => schema.defaultConsumptionTemp.min(-10).max(30),
  defaultFreezeTemp: (schema) => schema.defaultFreezeTemp.min(-20).max(10),
})
  .required({
    name: true,
    displayName: true,
    defaultConsumptionTemp: true,
    defaultFreezeTemp: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

const insertBeverageSubtypeSchema = createInsertSchema(beverage_subtypes, {
  name: (schema) => schema.name.min(1).max(50),
  displayName: (schema) => schema.displayName.min(1).max(100),
  consumptionTemp: (schema) => schema.consumptionTemp.min(-10).max(30),
  freezeTemp: (schema) => schema.freezeTemp.min(-20).max(10),
})
  .required({
    beverageTypeId: true,
    name: true,
    displayName: true,
    consumptionTemp: true,
    freezeTemp: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

export const beverageTypeSchemas = {
  select: createSelectSchema(beverage_types),
  insert: insertBeverageTypeSchema,
  patch: insertBeverageTypeSchema.partial(),
} as const;

export const beverageSubtypeSchemas = {
  select: createSelectSchema(beverage_subtypes),
  insert: insertBeverageSubtypeSchema,
  patch: insertBeverageSubtypeSchema.partial(),
} as const;
