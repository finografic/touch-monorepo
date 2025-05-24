import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const temperatureTimeProfiles = sqliteTable('temperature_time_profiles', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
});

export const temperatureTimeProfileSchemas = {
  select: createSelectSchema(temperatureTimeProfiles),
  insert: createInsertSchema(temperatureTimeProfiles),
  patch: createInsertSchema(temperatureTimeProfiles).partial(),
} as const;
