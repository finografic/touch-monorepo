import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { temperature_profiles } from './temperature_profiles.schema';
import createCuid from '@bugsnag/cuid';
import { sqliteBooleanField } from 'lib/zod-utils';
import { z } from 'zod';

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
    isDefault: () => sqliteBooleanField(),
    isActive: () => sqliteBooleanField(),
  }),
  insert: createInsertSchema(modes, {
    isDefault: () => sqliteBooleanField(),
    isActive: () => sqliteBooleanField(),
  }).omit({ id: true }),
  patch: createInsertSchema(modes, {
    isDefault: () => sqliteBooleanField().optional(),
    isActive: () => sqliteBooleanField().optional(),
  }).partial().extend({
    isDefault: sqliteBooleanField().optional(),
    isActive: sqliteBooleanField().optional(),
  }),
} as const;
