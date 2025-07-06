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

// Orders table with proper ID-based foreign keys
export const orders = sqliteTable('orders', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),

  // Mode enum column
  mode: text('mode', { enum: ['A', 'B', 'C'] })
    .notNull()
    .default('A'),

  // Proper ID-based foreign keys
  drinkTypeId: text('drink_type_id')
    .notNull()
    .references(() => drink_types.id, { onDelete: 'cascade' }),

  drinkSubtypeId: text('drink_subtype_id').references(() => drink_subtypes.id, { onDelete: 'set null' }),

  volumeId: text('volume_id')
    .notNull()
    .references(() => volumes.id, { onDelete: 'cascade' }),

  containerTypeId: text('container_type_id')
    .notNull()
    .references(() => container_types.id, { onDelete: 'cascade' }),

  temperatureProfileId: text('temperature_profile_id')
    .notNull()
    .references(() => temperature_profiles.id, { onDelete: 'cascade' }),

  // Temperature defaults
  defaultTempConsume: integer('default_temp_consume')
    .notNull()
    .$defaultFn(() => TEMPERATURE_RANGES.CONSUMPTION.MAX),
  defaultTempFreeze: integer('default_temp_freeze')
    .notNull()
    .$defaultFn(() => TEMPERATURE_RANGES.FREEZING.MIN),

  // Meta fields
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Define relations with proper ID-based joins
export const ordersRelations = relations(orders, ({ one }) => ({
  drinkType: one(drink_types, {
    fields: [orders.drinkTypeId],
    references: [drink_types.id],
  }),
  drinkSubtype: one(drink_subtypes, {
    fields: [orders.drinkSubtypeId],
    references: [drink_subtypes.id],
  }),
  volume: one(volumes, {
    fields: [orders.volumeId],
    references: [volumes.id],
  }),
  containerType: one(container_types, {
    fields: [orders.containerTypeId],
    references: [container_types.id],
  }),
  temperatureProfile: one(temperature_profiles, {
    fields: [orders.temperatureProfileId],
    references: [temperature_profiles.id],
  }),
}));

// Zod schema for validation with ID-based fields
const insertOrderSchema = createInsertSchema(orders, {
  mode: (schema) => schema.mode,
  drinkTypeId: (schema) => schema.drinkTypeId.min(1).max(50),
  drinkSubtypeId: (schema) => schema.drinkSubtypeId.max(50),
  volumeId: (schema) => schema.volumeId.min(1).max(50),
  containerTypeId: (schema) => schema.containerTypeId.min(1).max(50),
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
    drinkTypeId: true,
    volumeId: true,
    containerTypeId: true,
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
