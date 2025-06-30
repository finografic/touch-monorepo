import { sql } from 'drizzle-orm';
import { integer, sqliteView, text } from 'drizzle-orm/sqlite-core';

// Orders readable view - JOINs orders with reference tables to show both IDs and names
export const orders_readable = sqliteView('orders_readable').as((qb) =>
  qb
    .select({
      // Order fields
      id: sql`orders.id`.as('id'),
      isActive: sql`orders.is_active`.as('is_active'),
      createdAt: sql`orders.created_at`.as('created_at'),
      updatedAt: sql`orders.updated_at`.as('updated_at'),

      // Temperature fields
      defaultTempConsume: sql`orders.default_temp_consume`.as('default_temp_consume'),
      defaultTempFreeze: sql`orders.default_temp_freeze`.as('default_temp_freeze'),

      // Foreign key IDs (for proper relationships)
      drinkTypeId: sql`orders.drink_type_id`.as('drink_type_id'),
      drinkSubtypeId: sql`orders.drink_subtype_id`.as('drink_subtype_id'),
      volumeId: sql`orders.volume_id`.as('volume_id'),
      containerTypeId: sql`orders.container_type_id`.as('container_type_id'),
      temperatureProfileId: sql`orders.temperature_profile_id`.as('temperature_profile_id'),

      // Human-readable names (for display and debugging)
      drinkTypeName: sql`drink_types.name`.as('drink_type_name'),
      drinkSubtypeName: sql`drink_subtypes.name`.as('drink_subtype_name'),
      volumeName: sql`volumes.name`.as('volume_name'),
      containerTypeName: sql`container_types.name`.as('container_type_name'),
      temperatureProfileName: sql`temperature_profiles.id`.as('temperature_profile_name'), // Using ID since profiles don't have name
    })
    .from(sql`orders`)
    .leftJoin(sql`drink_types`, sql`orders.drink_type_id = drink_types.id`)
    .leftJoin(sql`drink_subtypes`, sql`orders.drink_subtype_id = drink_subtypes.id`)
    .leftJoin(sql`volumes`, sql`orders.volume_id = volumes.id`)
    .leftJoin(sql`container_types`, sql`orders.container_type_id = container_types.id`)
    .leftJoin(sql`temperature_profiles`, sql`orders.temperature_profile_id = temperature_profiles.id`),
);

// Note: Type inference not available with raw SQL views
// If needed, create manual type definition matching the select fields above
