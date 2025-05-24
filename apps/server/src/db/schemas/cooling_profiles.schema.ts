import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { temperature_profiles } from './temperature_profiles.schema';

export const cooling_profiles = sqliteTable('cooling_profiles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
});

// Define relations
export const coolingProfilesRelations = relations(cooling_profiles, ({ many }) => ({
  temperaturePoints: many(temperature_profiles),
}));

export const coolingProfileSchemas = {
  select: createSelectSchema(cooling_profiles),
  insert: createInsertSchema(cooling_profiles),
  patch: createInsertSchema(cooling_profiles).partial(),
} as const;
