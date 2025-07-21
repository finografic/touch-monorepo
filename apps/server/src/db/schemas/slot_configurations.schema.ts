import { sql } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const slot_configurations = sqliteTable('slot_configurations', {
  id: text('id').primaryKey(),
  slotNumber: integer('slot_number').notNull(),
  itemType: text('item_type', { enum: ['A', 'B', 'C'] }).notNull(),
  isSpecialPad: integer('is_special_pad', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export type SlotConfiguration = typeof slot_configurations.$inferSelect;
export type NewSlotConfiguration = typeof slot_configurations.$inferInsert;
