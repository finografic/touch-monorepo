import createCuid from '@bugsnag/cuid';
import * as v from 'valibot';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { ERROR_MESSAGES } from 'lib/valibot.errors';
import { sqliteBooleanField } from 'lib/valibot.utils';
import { TEMPERATURE_RANGES } from 'config/temperature.config';
import { container_types } from './container_types.schema';
import { drink_subtypes } from './drink_subtypes.schema';
import { drink_types } from './drink_types.schema';
import { modes } from './modes.schema';
import { temperature_profiles } from './temperature_profiles.schema';
import { volumes } from './volumes.schema';

// Orders table with proper ID-based foreign keys
export const orders = sqliteTable('orders', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),

  // Cooling profile reference
  modeId: text('mode_id')
    .notNull()
    .references(() => modes.id, { onDelete: 'cascade' }),

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
export const ordersRelations = relations(orders, ({ one, many }) => ({
  mode: one(modes, {
    fields: [orders.modeId],
    references: [modes.id],
  }),
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
  temperatureProfiles: many(temperature_profiles),
}));

const insertOrderSchema = v.omit(
  createInsertSchema(orders, {
    modeId:             v.pipe(v.string(), v.minLength(1, 'Mode is required')),
    drinkTypeId:        v.pipe(v.string(), v.minLength(1), v.maxLength(50)),
    drinkSubtypeId:     v.pipe(v.string(), v.maxLength(50)),
    volumeId:           v.pipe(v.string(), v.minLength(1), v.maxLength(50)),
    containerTypeId:    v.pipe(v.string(), v.minLength(1), v.maxLength(50)),
    defaultTempConsume: v.pipe(v.number(), v.integer(), v.minValue(TEMPERATURE_RANGES.CONSUMPTION.MIN, ERROR_MESSAGES.TEMPERATURE_CONSUMPTION_RANGE), v.maxValue(TEMPERATURE_RANGES.CONSUMPTION.MAX, ERROR_MESSAGES.TEMPERATURE_CONSUMPTION_RANGE)),
    defaultTempFreeze:  v.pipe(v.number(), v.integer(), v.minValue(TEMPERATURE_RANGES.FREEZING.MIN, ERROR_MESSAGES.TEMPERATURE_FREEZING_RANGE), v.maxValue(TEMPERATURE_RANGES.FREEZING.MAX, ERROR_MESSAGES.TEMPERATURE_FREEZING_RANGE)),
    isActive:           sqliteBooleanField(),
  }),
  ['id', 'createdAt', 'updatedAt'],
);

export const orderSchemas = {
  select: createSelectSchema(orders),
  insert: insertOrderSchema,
  patch: v.partial(
    v.object({
      ...insertOrderSchema.entries,
      isActive: v.optional(sqliteBooleanField()),
    }),
  ),
} as const;

export type OrderModel  = v.InferOutput<typeof orderSchemas.select>;
export type OrderInsert = v.InferOutput<typeof orderSchemas.insert>;
export type OrderPatch  = v.InferOutput<typeof orderSchemas.patch>;
