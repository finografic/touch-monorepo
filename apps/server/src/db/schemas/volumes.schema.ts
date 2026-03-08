import createCuid from '@bugsnag/cuid';
import * as v from 'valibot';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { sqliteBooleanField } from '../../lib/valibot.utils';

export const volumes = sqliteTable('volumes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  name: text('name').notNull().unique(), // Internal key: '25cl', '1l', etc.
  // JSON translations column for dynamic language support
  translations: text('translations', { mode: 'json' })
    .$type<Record<string, string>>()
    .notNull()
    .default({ 'en-GB': '' }),
  valueInMl: integer('value_in_ml').notNull(), // Normalized to milliliters
  sortOrder: integer('sort_order').notNull(), // For display ordering
  coolingFactor: real('cooling_factor').notNull().default(1), // Multiplier for cooling time

  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Field overrides: pass Valibot schemas directly (no callback wrapper)
const insertVolumeSchema = v.omit(
  createInsertSchema(volumes, {
    name:          v.pipe(v.string(), v.minLength(1), v.maxLength(20)),
    valueInMl:     v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(5000)),
    sortOrder:     v.pipe(v.number(), v.integer(), v.minValue(0)),
    coolingFactor: v.pipe(v.number(), v.minValue(0.1), v.maxValue(5)),
    isActive:      sqliteBooleanField(),
  }),
  ['id', 'createdAt', 'updatedAt'],
);

// Valibot equivalent of .partial().extend({ ... })
const patchVolumeSchema = v.partial(
  v.object({
    ...v.omit(insertVolumeSchema, ['translations']).entries,
    translations: v.optional(v.record(v.string(), v.string())),
    isActive:     v.optional(sqliteBooleanField()),
  }),
);

export const volumeSchemas = {
  select: createSelectSchema(volumes, {
    translations: v.optional(v.record(v.string(), v.string())),
  }),
  insert: insertVolumeSchema,
  patch:  patchVolumeSchema,
} as const;

export type VolumeModel  = v.InferOutput<typeof volumeSchemas.select>;
export type VolumeInsert = v.InferOutput<typeof volumeSchemas.insert>;
export type VolumePatch  = v.InferOutput<typeof volumeSchemas.patch>;
