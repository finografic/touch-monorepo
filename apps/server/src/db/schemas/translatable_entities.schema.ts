import createCuid from '@bugsnag/cuid';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import * as v from 'valibot';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { sqliteBooleanField } from '../../lib/valibot.utils';

// Configuration table for entities that need translation columns
export const translatable_entities = sqliteTable('translatable_entities', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  tableName: text('table_name').notNull().unique(), // 'drink_types', 'volumes', etc.
  entityName: text('entity_name').notNull(), // 'Drink Types', 'Volumes'
  description: text('description'), // Optional description for admin
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

const insertTranslatableEntitySchema = v.omit(
  createInsertSchema(translatable_entities, {
    tableName: v.pipe(v.string(), v.minLength(1), v.maxLength(50), v.regex(/^[a-z_]+$/)),
    entityName: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
    description: v.pipe(v.string(), v.maxLength(255)),
    sortOrder: v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(999)),
    isActive: sqliteBooleanField(),
  }),
  ['id', 'createdAt', 'updatedAt'],
);

export const translatableEntitySchemas = {
  select: createSelectSchema(translatable_entities),
  insert: insertTranslatableEntitySchema,
  patch: v.partial(
    v.object({
      ...insertTranslatableEntitySchema.entries,
      isActive: v.optional(sqliteBooleanField()),
    }),
  ),
} as const;

export type TranslatableEntityModel = v.InferOutput<typeof translatableEntitySchemas.select>;
export type TranslatableEntityInsert = v.InferOutput<typeof translatableEntitySchemas.insert>;
export type TranslatableEntityPatch = v.InferOutput<typeof translatableEntitySchemas.patch>;
