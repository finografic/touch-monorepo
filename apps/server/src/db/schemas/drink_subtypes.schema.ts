import {
  TEMP_CONSUME_SCHEMA_MAX,
  TEMP_CONSUME_SCHEMA_MIN,
  TEMP_FREEZE_SCHEMA_MAX,
  TEMP_FREEZE_SCHEMA_MIN,
} from '@workspace/shared/constants';

import createCuid from '@bugsnag/cuid';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import * as v from 'valibot';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { sqliteBooleanField } from '../../lib/valibot.utils';
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
  // JSON translations column for dynamic language support
  translations: text('translations', { mode: 'json' })
    .$type<Record<string, string>>()
    .notNull()
    .default({ 'en-GB': '' }),
  defaultTempConsume: integer('default_temp_consume').notNull(), // Can override parent's default
  defaultTempFreeze: integer('default_temp_freeze').notNull(), // Can override parent's default

  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

const insertDrinkSubtypeSchema = v.omit(
  createInsertSchema(drink_subtypes, {
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
    isActive: sqliteBooleanField(),
  }),
  ['id', 'createdAt', 'updatedAt'],
);

const patchDrinkSubtypeSchema = v.partial(
  v.object({
    ...v.omit(insertDrinkSubtypeSchema, ['translations']).entries,
    translations: v.optional(v.record(v.string(), v.string())),
    isActive: v.optional(sqliteBooleanField()),
  }),
);

export const drinkSubtypeSchemas = {
  select: createSelectSchema(drink_subtypes, {
    translations: v.optional(v.record(v.string(), v.string())),
  }),
  insert: insertDrinkSubtypeSchema,
  patch: patchDrinkSubtypeSchema,
} as const;

export type DrinkSubtypeModel = v.InferOutput<typeof drinkSubtypeSchemas.select>;
export type DrinkSubtypeInsert = v.InferOutput<typeof drinkSubtypeSchemas.insert>;
export type DrinkSubtypePatch = v.InferOutput<typeof drinkSubtypeSchemas.patch>;
