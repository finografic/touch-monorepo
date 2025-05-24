import { real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { cooling_profiles } from './cooling_profiles.schema';
import { orders } from './orders.schema';

export const temperature_profiles = sqliteTable('temperature_profiles', {
  id: text('id').primaryKey(),
  coolingProfileId: text('cooling_profile_id')
    .notNull()
    .references(() => cooling_profiles.id, { onDelete: 'cascade' }),
  temperature: real('temperature').notNull(),
  timeA: real('time_a').notNull(),
  timeB: real('time_b').notNull(),
  timeC: real('time_c').notNull(),
});

// Define relations
export const temperatureProfilesRelations = relations(temperature_profiles, ({ one, many }) => ({
  coolingProfile: one(cooling_profiles, {
    fields: [temperature_profiles.coolingProfileId],
    references: [cooling_profiles.id],
  }),
  orders: many(orders),
}));

export const temperatureProfileSchemas = {
  select: createSelectSchema(temperature_profiles),
  insert: createInsertSchema(temperature_profiles),
  patch: createInsertSchema(temperature_profiles).partial(),
} as const;
