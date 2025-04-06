import createCuid from '@bugsnag/cuid';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { beverage_subtypes, beverage_types } from './beverage_types.schema';
import { container_types } from './container_types.schema';
import { volumes } from './volumes.schema';

export const beverage_configs = sqliteTable('beverage_configs', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),

  // Core relationships
  beverageTypeId: text('beverage_type_id')
    .notNull()
    .references(() => beverage_types.id),
  beverageSubtypeId: text('beverage_subtype_id').references(() => beverage_subtypes.id),
  containerTypeId: text('container_type_id')
    .notNull()
    .references(() => container_types.id),
  volumeId: text('volume_id')
    .notNull()
    .references(() => volumes.id),

  // Temperature settings
  defaultConsumptionTemp: integer('default_consumption_temp').notNull(), // in Celsius
  minConsumptionTemp: integer('min_consumption_temp').notNull(), // Minimum allowed temp
  maxConsumptionTemp: integer('max_consumption_temp').notNull(), // Maximum allowed temp

  // Time-temperature table references (from the PowerPoint example)
  timeTableId1: text('time_table_id_1').notNull(), // e.g., '1001' for element 1
  timeTableId2: text('time_table_id_2').notNull(), // e.g., '2001' for elements 2-9
  timeTableId3: text('time_table_id_3').notNull(), // e.g., '3001' for element 10

  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Zod schema for validation
const insertBeverageConfigSchema = createInsertSchema(beverage_configs, {
  defaultConsumptionTemp: (schema) => schema.defaultConsumptionTemp.min(-10).max(30),
  minConsumptionTemp: (schema) => schema.minConsumptionTemp.min(-10).max(30),
  maxConsumptionTemp: (schema) => schema.maxConsumptionTemp.min(-10).max(30),
  timeTableId1: (schema) => schema.timeTableId1.length(4).regex(/^\d{4}$/),
  timeTableId2: (schema) => schema.timeTableId2.length(4).regex(/^\d{4}$/),
  timeTableId3: (schema) => schema.timeTableId3.length(4).regex(/^\d{4}$/),
})
  .required({
    beverageTypeId: true,
    containerTypeId: true,
    volumeId: true,
    defaultConsumptionTemp: true,
    minConsumptionTemp: true,
    maxConsumptionTemp: true,
    timeTableId1: true,
    timeTableId2: true,
    timeTableId3: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

export const beverageConfigSchemas = {
  select: createSelectSchema(beverage_configs),
  insert: insertBeverageConfigSchema,
  patch: insertBeverageConfigSchema.partial(),
} as const;
