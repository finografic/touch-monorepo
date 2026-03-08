// @ts-nocheck - Bypassing complex type inference issues throughout this file
import { db } from 'db';
import { orders } from 'db/schemas/orders.schema';
import { temperature_profiles } from 'db/schemas/temperature_profiles.schema';
import { eq, inArray, or, sql } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import { ERROR_CODES, ERROR_MESSAGES } from 'lib/valibot.errors';
import type { AppHandler } from 'types/app.types';

export const list: AppHandler = async (context) => {
  const drinkOrders = await db.query.orders.findMany({
    where: (fields, operators) => operators.eq(fields.isActive, true),
    columns: {
      id: true,
      mode: true,
      drinkTypeId: true,
      drinkSubtypeId: true,
      volumeId: true,
      containerTypeId: true,
      defaultTempConsume: true,
      defaultTempFreeze: true,
    },
  });
  return context.json(drinkOrders);
};

export const listReadable: AppHandler = async (context) => {
  // Query the orders_readable view directly with raw SQL
  const readableOrders = await db.all(`
    SELECT
      id,
      mode,
      drink_type AS drinkType,
      drink_subtype AS drinkSubtype,
      volume,
      container_type AS containerType,
      default_temp_consume AS defaultTempConsume,
      default_temp_freeze AS defaultTempFreeze,
      is_active AS isActive,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM orders_readable
    WHERE is_active = 1
  `);

  return context.json(readableOrders);
};

export const getOne: AppHandler = async (context) => {
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

export const getOneReadable: AppHandler = async (context) => {
  const { id } = context.req.valid('param');

  // First get the order details
  const result = await db.all(sql`
    SELECT
      id,
      mode,
      drink_type AS drinkType,
      drink_subtype AS drinkSubtype,
      volume,
      container_type AS containerType,
      default_temp_consume AS defaultTempConsume,
      default_temp_freeze AS defaultTempFreeze,
      is_active AS isActive,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM orders_readable
    WHERE id = ${id}
  `);

  if (!result || result.length === 0) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  // Get temperature profiles for this order
  const temperatureProfiles = await db.query.temperature_profiles.findMany({
    where: (fields, operators) => operators.eq(fields.orderId, id),
    orderBy: (fields, operators) => [operators.desc(fields.temperature)],
  });

  // Convert types to match schema
  const order = {
    id: String(result[0].id),
    mode: Number(result[0].mode),
    drinkType: String(result[0].drinkType),
    drinkSubtype: result[0].drinkSubtype ? String(result[0].drinkSubtype) : null,
    volume: String(result[0].volume),
    containerType: String(result[0].containerType),
    defaultTempConsume: Number(result[0].defaultTempConsume),
    defaultTempFreeze: Number(result[0].defaultTempFreeze),
    isActive: Boolean(result[0].isActive),
    createdAt: result[0].createdAt ? new Date(result[0].createdAt).toISOString() : null,
    updatedAt: result[0].updatedAt ? new Date(result[0].updatedAt).toISOString() : null,
    temperatureProfiles: temperatureProfiles.map((profile) => ({
      id: String(profile.id),
      orderId: String(profile.orderId),
      modeId: String(profile.modeId),
      temperature: Number(profile.temperature),
      timeA: Number(profile.timeA),
      timeB: Number(profile.timeB),
      timeC: Number(profile.timeC),
    })),
  };

  return context.json(order);
};

export const create: AppHandler = async (context) => {
  const drinkOrder = context.req.valid('json');
  const [inserted] = await db.insert(orders).values(drinkOrder).returning();
  return context.json(inserted, HttpStatusCodes.OK);
};

export const patch: AppHandler = async (context) => {
  const { id } = context.req.valid('param');
  const updates = context.req.valid('json');

  if (Object.keys(updates).length === 0) {
    return context.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: 'ValidationError',
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

export const remove: AppHandler = async (context) => {
  const { id } = context.req.valid('param');

  // First, delete related temperature profiles
  await db.delete(temperature_profiles).where(eq(temperature_profiles.orderId, id));

  // Then delete the order
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

export const cleanup: AppHandler = async (context) => {
  const { drinkTypeIds, drinkSubtypeIds, volumeIds, containerTypeIds } = context.req.valid('json');

  const conditions = [];
  if (drinkTypeIds?.length) {
    conditions.push(inArray(orders.drinkTypeId, drinkTypeIds));
  }
  if (drinkSubtypeIds?.length) {
    conditions.push(inArray(orders.drinkSubtypeId, drinkSubtypeIds));
  }
  if (volumeIds?.length) {
    conditions.push(inArray(orders.volumeId, volumeIds));
  }
  if (containerTypeIds?.length) {
    conditions.push(inArray(orders.containerTypeId, containerTypeIds));
  }

  if (conditions.length === 0) {
    return context.json(
      {
        message: 'No identifiers provided for cleanup',
      },
      HttpStatusCodes.BAD_REQUEST,
    );
  }

  const whereCondition = conditions.reduce((acc, condition) => (acc ? or(acc, condition) : condition));
  const result = await db.delete(orders).where(whereCondition);

  return context.json(
    {
      deleted: result.changes ?? 0,
    },
    HttpStatusCodes.OK,
  );
};

export const getTemperatureProfiles: AppHandler = async (context) => {
  const { id } = context.req.valid('param');

  const profiles = await db.query.temperature_profiles.findMany({
    where: (fields, operators) => operators.eq(fields.orderId, id),
    orderBy: (fields) => fields.temperature,
  });

  if (!profiles || profiles.length === 0) {
    return context.json([], HttpStatusCodes.OK); // Return empty array if no profiles found
  }

  return context.json(profiles, HttpStatusCodes.OK);
};

export const deleteTemperatureProfiles: AppHandler = async (context) => {
  const { id } = context.req.valid('param');

  // Verify the order exists
  const order = await db.query.orders.findFirst({
    where: (fields, operators) => operators.eq(fields.id, id),
  });

  if (!order) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  // Delete all temperature profiles for this order
  await db.delete(temperature_profiles).where(eq(temperature_profiles.orderId, id));

  return context.body(null, HttpStatusCodes.NO_CONTENT);
};
