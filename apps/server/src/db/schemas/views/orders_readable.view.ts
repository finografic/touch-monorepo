import { eq, sql } from 'drizzle-orm';
import { sqliteView } from 'drizzle-orm/sqlite-core';
import { orders } from '../orders.schema';
import { drink_types } from '../drink_types.schema';
import { drink_subtypes } from '../drink_subtypes.schema';
import { volumes } from '../volumes.schema';
import { container_types } from '../container_types.schema';
import { temperature_profiles } from '../temperature_profiles.schema';

// Orders readable view - JOINs orders with reference tables to show both IDs and names
export const orders_readable = sqliteView('orders_readable').as((qb) =>
  qb
    .select({
      // Order fields
      id: orders.id,
      isActive: orders.isActive,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,

      // Temperature fields
      defaultTempConsume: orders.defaultTempConsume,
      defaultTempFreeze: orders.defaultTempFreeze,

      // Foreign key IDs (for proper relationships)
      drinkTypeId: orders.drinkTypeId,
      drinkSubtypeId: orders.drinkSubtypeId,
      volumeId: orders.volumeId,
      containerTypeId: orders.containerTypeId,
      temperatureProfileId: orders.temperatureProfileId,

      // Human-readable names (for display and debugging)
      drinkTypeName: drink_types.name,
      drinkSubtypeName: drink_subtypes.name,
      volumeName: volumes.name,
      containerTypeName: container_types.name,
      temperatureProfileName: temperature_profiles.id, // Using ID since profiles don't have name
    })
    .from(orders)
    .leftJoin(drink_types, eq(orders.drinkTypeId, drink_types.id))
    .leftJoin(drink_subtypes, eq(orders.drinkSubtypeId, drink_subtypes.id))
    .leftJoin(volumes, eq(orders.volumeId, volumes.id))
    .leftJoin(container_types, eq(orders.containerTypeId, container_types.id))
    .leftJoin(temperature_profiles, eq(orders.temperatureProfileId, temperature_profiles.id)),
);

// Note: Type inference not available with raw SQL views
// If needed, create manual type definition matching the select fields above
