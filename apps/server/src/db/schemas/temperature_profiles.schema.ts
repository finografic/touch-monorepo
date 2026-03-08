import { randomUUID } from 'crypto';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import * as v from 'valibot';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { modes } from './modes.schema';
import { orders } from './orders.schema';

export const temperature_profiles = sqliteTable('temperature_profiles', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
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
  insert: v.omit(createInsertSchema(temperature_profiles), ['id']),
  patch: v.partial(createInsertSchema(temperature_profiles)),
} as const;

export type TemperatureProfileModel = v.InferOutput<typeof temperatureProfileSchemas.select>;
export type TemperatureProfileInsert = v.InferOutput<typeof temperatureProfileSchemas.insert>;
export type TemperatureProfilePatch = v.InferOutput<typeof temperatureProfileSchemas.patch>;
