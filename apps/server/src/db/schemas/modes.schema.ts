import createCuid from '@bugsnag/cuid';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import * as v from 'valibot';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { sqliteBooleanField } from 'lib/valibot.utils';
import { temperature_profiles } from './temperature_profiles.schema';

export const modes = sqliteTable('modes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  name: text('name').notNull(),
  isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(false),
});

// Define relations
export const modeRelations = relations(modes, ({ many }) => ({
  temperaturePoints: many(temperature_profiles),
}));

export const modeSchemas = {
  select: createSelectSchema(modes, {
    isDefault: sqliteBooleanField(),
    isActive: sqliteBooleanField(),
  }),
  insert: v.omit(
    createInsertSchema(modes, {
      isDefault: sqliteBooleanField(),
      isActive: sqliteBooleanField(),
    }),
    ['id'],
  ),
  patch: v.partial(
    v.object({
      name: v.optional(v.string()),
      isDefault: v.optional(sqliteBooleanField()),
      isActive: v.optional(sqliteBooleanField()),
    }),
  ),
} as const;

export type ModeModel = v.InferOutput<typeof modeSchemas.select>;
export type ModeInsert = v.InferOutput<typeof modeSchemas.insert>;
export type ModePatch = v.InferOutput<typeof modeSchemas.patch>;
