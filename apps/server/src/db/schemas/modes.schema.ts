import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { temperature_profiles } from './temperature_profiles.schema';
import createCuid from '@bugsnag/cuid';

export const modes = sqliteTable('modes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createCuid()),
  name: text('name').notNull(),
  isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
});

// Define relations
export const modeRelations = relations(modes, ({ many }) => ({
  temperaturePoints: many(temperature_profiles),
}));

export const modeSchemas = {
  select: createSelectSchema(modes),
  insert: createInsertSchema(modes).omit({ id: true }),
  patch: createInsertSchema(modes).partial(),
} as const;
