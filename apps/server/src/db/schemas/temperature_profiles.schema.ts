import { real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const temperatureProfiles = sqliteTable('temperature_profiles', {
  id: text('id').primaryKey(),
  profileId: text('profile_id').notNull(),
  temperature: real('temperature').notNull(),
  timeA: real('time_a').notNull(),
  timeB: real('time_b').notNull(),
  timeC: real('time_c').notNull(),
});

export const temperatureProfileSchemas = {
  select: createSelectSchema(temperatureProfiles),
  insert: createInsertSchema(temperatureProfiles),
  patch: createInsertSchema(temperatureProfiles).partial(),
} as const;
