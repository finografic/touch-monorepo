import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const slot_configurations = sqliteTable('slot_configurations', {
  id: text('id').primaryKey(),
  slotNumber: integer('slot_number').notNull(),
  slotType: text('slot_type', { enum: ['A', 'B', 'C'] }).notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  relayNumber: integer('relay_number'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export type SlotConfiguration = typeof slot_configurations.$inferSelect;
export type NewSlotConfiguration = typeof slot_configurations.$inferInsert;
