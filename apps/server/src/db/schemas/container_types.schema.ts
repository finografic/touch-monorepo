import createCuid from '@bugsnag/cuid';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import * as v from 'valibot';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { sqliteBooleanField } from '../../lib/valibot.utils';

export const container_types = sqliteTable('container_types', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  name: text('name').notNull().unique(), // Internal name: 'plastic', 'glass', 'metal'
  // JSON translations column for dynamic language support
  translations: text('translations', { mode: 'json' })
    .$type<Record<string, string>>()
    .notNull()
    .default({ 'en-GB': '' }),
  thermalConductivity: integer('thermal_conductivity').notNull(), // Affects cooling time

  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

const insertContainerTypeSchema = v.omit(
  createInsertSchema(container_types, {
    name: v.pipe(v.string(), v.minLength(1), v.maxLength(50)),
    thermalConductivity: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(100)),
    isActive: sqliteBooleanField(),
  }),
  ['id', 'createdAt', 'updatedAt'],
);

const patchContainerTypeSchema = v.partial(
  v.object({
    ...v.omit(insertContainerTypeSchema, ['translations']).entries,
    translations: v.optional(v.record(v.string(), v.string())),
    isActive: v.optional(sqliteBooleanField()),
  }),
);

export const containerTypeSchemas = {
  select: createSelectSchema(container_types, {
    translations: v.optional(v.record(v.string(), v.string())),
  }),
  insert: insertContainerTypeSchema,
  patch: patchContainerTypeSchema,
} as const;

export type ContainerTypeModel = v.InferOutput<typeof containerTypeSchemas.select>;
export type ContainerTypeInsert = v.InferOutput<typeof containerTypeSchemas.insert>;
export type ContainerTypePatch = v.InferOutput<typeof containerTypeSchemas.patch>;
