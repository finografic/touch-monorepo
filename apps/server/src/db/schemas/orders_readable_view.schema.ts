import { sql } from 'drizzle-orm';
import { integer, sqliteView, text } from 'drizzle-orm/sqlite-core';
import { orders } from './orders.schema';

// Orders readable view using raw SQL - following Drizzle docs "Declaring views with raw SQL"
export const orders_readable = sqliteView('orders_readable', {
  id: text('id').notNull(),
  drinkTypeId: text('drink_type_id').notNull(),
  drinkSubtypeId: text('drink_subtype_id'),
  volumeId: text('volume_id').notNull(),
  containerTypeId: text('container_type_id').notNull(),
  temperatureProfileId: text('temperature_profile_id').notNull(),
  defaultTempConsume: integer('default_temp_consume').notNull(),
  defaultTempFreeze: integer('default_temp_freeze').notNull(),
  isActive: integer('is_active').notNull(),
  createdAt: integer('created_at'),
  updatedAt: integer('updated_at'),
}).as(sql`SELECT * FROM ${orders}`);
