import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { temperature_profiles } from './temperature_profiles.schema';

export const modes = sqliteTable('modes', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
});

// Define relations
export const modeRelations = relations(modes, ({ many }) => ({
  temperaturePoints: many(temperature_profiles),
}));

export const modeSchemas = {
  select: createSelectSchema(modes),
  insert: createInsertSchema(modes),
  patch: createInsertSchema(modes).partial(),
} as const;
