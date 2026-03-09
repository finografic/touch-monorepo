import {
  TEMP_CONSUME_SCHEMA_MAX,
  TEMP_CONSUME_SCHEMA_MIN,
  TEMP_FREEZE_SCHEMA_MAX,
  TEMP_FREEZE_SCHEMA_MIN,
} from '@workspace/shared/constants';

import createCuid from '@bugsnag/cuid';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import * as v from 'valibot';

import { sqliteBooleanField } from '../../lib/valibot.utils';

// Main drink types table
export const drink_types = sqliteTable('drink_types', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  name: text('name').notNull().unique(), // e.g., 'Cerveza', 'Vino', 'Licor', etc.
  // JSON translations column for dynamic language support
  translations: text('translatSSions', { mode: 'json' })
    .$type<Record<string, string>>()
    .notNull()
    .default({ 'en-GB': '' }),
  hasSubtypes: integer('has_subtypes', { mode: 'boolean' }).notNull().default(false),
  defaultTempConsume: integer('default_temp_consume').notNull(), // in Celsius
  defaultTempFreeze: integer('default_temp_freeze').notNull(), // in Celsius
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

const insertDrinkTypeSchema = v.omit(
  createInsertSchema(drink_types, {
    name: v.pipe(v.string(), v.minLength(1), v.maxLength(50)),
    defaultTempConsume: v.pipe(
      v.number(),
      v.integer(),
      v.minValue(TEMP_CONSUME_SCHEMA_MIN),
      v.maxValue(TEMP_CONSUME_SCHEMA_MAX),
    ),
    defaultTempFreeze: v.pipe(
      v.number(),
      v.integer(),
      v.minValue(TEMP_FREEZE_SCHEMA_MIN),
      v.maxValue(TEMP_FREEZE_SCHEMA_MAX),
    ),
    hasSubtypes: sqliteBooleanField(),
    isActive: sqliteBooleanField(),
  }),
  ['id', 'createdAt', 'updatedAt'],
);

const patchDrinkTypeSchema = v.partial(
  v.object({
    ...v.omit(insertDrinkTypeSchema, ['translations']).entries,
    translations: v.optional(v.record(v.string(), v.string())),
    hasSubtypes: v.optional(sqliteBooleanField()),
    isActive: v.optional(sqliteBooleanField()),
  }),
);

export const drinkTypeSchemas = {
  select: createSelectSchema(drink_types, {
    translations: v.optional(v.record(v.string(), v.string())),
  }),
  insert: insertDrinkTypeSchema,
  patch: patchDrinkTypeSchema,
} as const;

export type DrinkTypeModel = v.InferOutput<typeof drinkTypeSchemas.select>;
export type DrinkTypeInsert = v.InferOutput<typeof drinkTypeSchemas.insert>;
export type DrinkTypePatch = v.InferOutput<typeof drinkTypeSchemas.patch>;
