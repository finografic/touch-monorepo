import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { orders } from './orders.schema';
import { modes } from './modes.schema';

export const temperature_profiles = sqliteTable('temperature_profiles', {
  id: text('id').primaryKey(),
  orderId: text('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  modeId: text('mode_id')
    .notNull()
    .references(() => modes.id, { onDelete: 'cascade' }),
  temperature: integer('temperature').notNull(),
  timeA: integer('time_a').notNull(),
  timeB: integer('time_b').notNull(),
  timeC: integer('time_c').notNull(),
});

export const temperatureProfilesRelations = relations(temperature_profiles, ({ one }) => ({
  order: one(orders, {
    fields: [temperature_profiles.orderId],
    references: [orders.id],
  }),
  mode: one(modes, {
    fields: [temperature_profiles.modeId],
    references: [modes.id],
  }),
}));

export const temperatureProfileSchemas = {
  select: createSelectSchema(temperature_profiles),
  insert: createInsertSchema(temperature_profiles),
  patch: createInsertSchema(temperature_profiles).partial(),
} as const;
