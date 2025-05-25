import createCuid from '@bugsnag/cuid';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { drink_types } from './drink_types.schema';
import { drink_subtypes } from './drink_subtypes.schema';
import { container_types } from './container_types.schema';
import { volumes } from './volumes.schema';

export const drink_configs = sqliteTable('drink_configs', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),

  // Core relationships
  drinkTypeId: text('drink_type_id')
    .notNull()
    .references(() => drink_types.id),
  drinkSubtypeId: text('drink_subtype_id').references(() => drink_subtypes.id),
  containerTypeId: text('container_type_id')
    .notNull()
    .references(() => container_types.id),
  volumeId: text('volume_id')
    .notNull()
    .references(() => volumes.id),

  // Temperature settings
  defaultTempConsume: integer('default_temp_consume').notNull(), // in Celsius
  minTempConsume: integer('min_temp_consume').notNull(), // Minimum allowed temp
  maxTempConsume: integer('max_temp_consume').notNull(), // Maximum allowed temp

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

// Define relations
export const drinkConfigsRelations = relations(drink_configs, ({ one }) => ({
  drinkType: one(drink_types, {
    fields: [drink_configs.drinkTypeId],
    references: [drink_types.id],
  }),
  drinkSubtype: one(drink_subtypes, {
    fields: [drink_configs.drinkSubtypeId],
    references: [drink_subtypes.id],
  }),
  containerType: one(container_types, {
    fields: [drink_configs.containerTypeId],
    references: [container_types.id],
  }),
  volume: one(volumes, {
    fields: [drink_configs.volumeId],
    references: [volumes.id],
  }),
}));

// Zod schema for validation
const insertDrinkConfigSchema = createInsertSchema(drink_configs, {
  defaultTempConsume: (schema) => schema.defaultTempConsume.min(-10).max(30),
  minTempConsume: (schema) => schema.minTempConsume.min(-10).max(30),
  maxTempConsume: (schema) => schema.maxTempConsume.min(-10).max(30),
  timeTableId1: (schema) => schema.timeTableId1.length(4).regex(/^\d{4}$/),
  timeTableId2: (schema) => schema.timeTableId2.length(4).regex(/^\d{4}$/),
  timeTableId3: (schema) => schema.timeTableId3.length(4).regex(/^\d{4}$/),
})
  .required({
    drinkTypeId: true,
    containerTypeId: true,
    volumeId: true,
    defaultTempConsume: true,
    minTempConsume: true,
    maxTempConsume: true,
    timeTableId1: true,
    timeTableId2: true,
    timeTableId3: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

export const drinkConfigSchemas = {
  select: createSelectSchema(drink_configs),
  insert: insertDrinkConfigSchema,
  patch: insertDrinkConfigSchema.partial(),
} as const;
