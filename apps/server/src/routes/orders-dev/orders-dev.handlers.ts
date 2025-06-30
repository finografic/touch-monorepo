import type { AppRouteHandler } from 'types/app.types';
import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from './orders-dev.routes';
import { db } from 'db';
import { orders, orders_readable } from 'db/schemas';
import { eq } from 'drizzle-orm';
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from 'lib/constants';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';

export const list: AppRouteHandler<ListRoute> = async (context) => {
  // Query using raw SQL to get both IDs and names - the "view" approach
  const drinkOrders = await db.all(`
    SELECT
      orders.id,
      orders.is_active as isActive,
      orders.created_at as createdAt,
      orders.updated_at as updatedAt,
      orders.default_temp_consume as defaultTempConsume,
      orders.default_temp_freeze as defaultTempFreeze,

      -- Foreign key IDs (for proper relationships)
      orders.drink_type_id as drinkTypeId,
      orders.drink_subtype_id as drinkSubtypeId,
      orders.volume_id as volumeId,
      orders.container_type_id as containerTypeId,
      orders.temperature_profile_id as temperatureProfileId,

      -- Human-readable names (for display and debugging)
      COALESCE(drink_types.name, 'Unknown') as drinkTypeName,
      drink_subtypes.name as drinkSubtypeName,
      COALESCE(volumes.name, 'Unknown') as volumeName,
      COALESCE(container_types.name, 'Unknown') as containerTypeName,
      COALESCE(temperature_profiles.id, 'Unknown') as temperatureProfileName

    FROM orders
    LEFT JOIN drink_types ON orders.drink_type_id = drink_types.id
    LEFT JOIN drink_subtypes ON orders.drink_subtype_id = drink_subtypes.id
    LEFT JOIN volumes ON orders.volume_id = volumes.id
    LEFT JOIN container_types ON orders.container_type_id = container_types.id
    LEFT JOIN temperature_profiles ON orders.temperature_profile_id = temperature_profiles.id
    WHERE orders.is_active = 1
  `);

  // Transform dates to strings to match schema
  const formattedOrders = drinkOrders.map((order: any) => ({
    ...order,
    isActive: Boolean(order.isActive),
    createdAt: new Date(order.createdAt).toISOString(),
    updatedAt: new Date(order.updatedAt).toISOString(),
  }));

  return context.json(formattedOrders);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const drinkOrder = await db.query.orders.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!drinkOrder) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return context.json(drinkOrder, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateRoute> = async (context) => {
  const drinkOrder = context.req.valid('json');
  const [inserted] = await db.insert(orders).values(drinkOrder).returning();
  return context.json(inserted, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const updates = context.req.valid('json');

  if (Object.keys(updates).length === 0) {
    return context.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: 'ZodError',
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  const [drinkOrder] = await db.update(orders).set(updates).where(eq(orders.id, id)).returning();

  if (!drinkOrder) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return context.json(drinkOrder, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const result = await db.delete(orders).where(eq(orders.id, id));

  if (result.changes === 0) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return context.body(null, HttpStatusCodes.NO_CONTENT);
};
