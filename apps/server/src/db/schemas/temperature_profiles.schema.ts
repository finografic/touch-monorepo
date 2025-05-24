import { real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const temperature_profiles = sqliteTable('temperature_profiles', {
  id: text('id').primaryKey(),
  profileId: text('profile_id').notNull(),
  temperature: real('temperature').notNull(),
  timeA: real('time_a').notNull(),
  timeB: real('time_b').notNull(),
  timeC: real('time_c').notNull(),
});

export const temperatureProfileSchemas = {
  select: createSelectSchema(temperature_profiles),
  insert: createInsertSchema(temperature_profiles),
  patch: createInsertSchema(temperature_profiles).partial(),
} as const;
