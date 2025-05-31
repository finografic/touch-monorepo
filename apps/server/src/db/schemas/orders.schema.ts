import createCuid from '@bugsnag/cuid';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { drink_types } from './drink_types.schema';
import { drink_subtypes } from './drink_subtypes.schema';
import { container_types } from './container_types.schema';
import { volumes } from './volumes.schema';
import { temperature_profiles } from './temperature_profiles.schema';
import { TEMPERATURE_RANGES, ZOD_ERROR_MESSAGES } from '../../lib/constants';

// Orders table
export const orders = sqliteTable('orders', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),

  drinkTypeName: text('drink_type_name')
    .notNull()
    .references(() => drink_types.name, { onDelete: 'cascade' }), // references drink_types.name
  drinkSubtypeName: text('drink_subtype_name').references(() => drink_subtypes.name, {
    onDelete: 'set null',
  }), // references drink_subtypes.name (nullable)
  volumeName: text('volume_name')
    .notNull()
    .references(() => volumes.name, { onDelete: 'cascade' }), // references volumes.name
  containerTypeName: text('container_type_name')
    .notNull()
    .references(() => container_types.name, { onDelete: 'cascade' }), // references container_types.name
  defaultTempConsume: integer('default_temp_consume')
    .notNull()
    .$defaultFn(() => TEMPERATURE_RANGES.CONSUMPTION.MAX),
  defaultTempFreeze: integer('default_temp_freeze')
    .notNull()
    .$defaultFn(() => TEMPERATURE_RANGES.FREEZING.MIN),
  temperatureProfileId: text('temperature_profile_id')
    .notNull()
    .references(() => temperature_profiles.id, { onDelete: 'cascade' }),

  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Define relations
export const ordersRelations = relations(orders, ({ one }) => ({
  drinkType: one(drink_types, {
    fields: [orders.drinkTypeName],
    references: [drink_types.name],
  }),
  drinkSubtype: one(drink_subtypes, {
    fields: [orders.drinkSubtypeName],
    references: [drink_subtypes.name],
  }),
  volume: one(volumes, {
    fields: [orders.volumeName],
    references: [volumes.name],
  }),
  containerType: one(container_types, {
    fields: [orders.containerTypeName],
    references: [container_types.name],
  }),
  temperatureProfile: one(temperature_profiles, {
    fields: [orders.temperatureProfileId],
    references: [temperature_profiles.id],
  }),
}));

// Zod schema for validation
const insertOrderSchema = createInsertSchema(orders, {
  drinkTypeName: (schema) => schema.drinkTypeName.min(1).max(50),
  drinkSubtypeName: (schema) => schema.drinkSubtypeName.max(50),
  volumeName: (schema) => schema.volumeName.min(1).max(50),
  containerTypeName: (schema) => schema.containerTypeName.min(1).max(50),
  temperatureProfileId: (schema) => schema.temperatureProfileId.min(1).max(50),
  defaultTempConsume: (schema) =>
    schema.defaultTempConsume
      .min(TEMPERATURE_RANGES.CONSUMPTION.MIN, ZOD_ERROR_MESSAGES.TEMPERATURE_CONSUMPTION_RANGE)
      .max(TEMPERATURE_RANGES.CONSUMPTION.MAX, ZOD_ERROR_MESSAGES.TEMPERATURE_CONSUMPTION_RANGE),
  defaultTempFreeze: (schema) =>
    schema.defaultTempFreeze
      .min(TEMPERATURE_RANGES.FREEZING.MIN, ZOD_ERROR_MESSAGES.TEMPERATURE_FREEZING_RANGE)
      .max(TEMPERATURE_RANGES.FREEZING.MAX, ZOD_ERROR_MESSAGES.TEMPERATURE_FREEZING_RANGE),
})
  .required({
    drinkTypeName: true,
    volumeName: true,
    containerTypeName: true,
    defaultTempConsume: true,
    temperatureProfileId: true,
    defaultTempFreeze: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

export const orderSchemas = {
  select: createSelectSchema(orders),
  insert: insertOrderSchema,
  patch: insertOrderSchema.partial(),
} as const;
