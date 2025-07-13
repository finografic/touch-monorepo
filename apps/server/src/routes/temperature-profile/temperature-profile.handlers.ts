import type { AppRouteHandler } from 'types/app.types';
import type {
  CreateRoute,
  GetByTemperatureRoute,
  GetMinMaxRoute,
  GetOneRoute,
  ListRoute,
  PatchRoute,
  RemoveRoute,
} from './temperature-profile.routes';
import { temperature_profiles } from 'db/schemas/temperature_profiles.schema';
import { db } from 'db';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from 'lib/constants';
import { and, eq, inArray, max, min } from 'drizzle-orm';
import chalk from 'chalk';

// ======================================================================== //

export const list: AppRouteHandler<ListRoute> = async (context) => {
  // Get orderId from query params
  const orderId = context.req.query('orderId');
  if (!orderId) {
    // Return empty array for missing orderId (to match OpenAPI spec)
    return context.json([], HttpStatusCodes.OK);
  }

  // === Temperature filtering temporarily disabled: only filtering by orderId ===
  // const temperatureParam = context.req.query('temperature[$in]');
  // const temperatures = temperatureParam
  //   ?.split(',')
  //   .map(Number)
  //   .filter((t) => !Number.isNaN(t));
  //
  // const whereClause = (fields, operators) => {
  //   let clause = operators.eq(fields.orderId, orderId);
  //   if (temperatures?.length) {
  //     clause = operators.and(clause, operators.inArray(fields.temperature, temperatures));
  //   }
  //   return clause;
  // };

  // Only filter by orderId
  const temperatureProfiles = await db.query.temperature_profiles.findMany({
    columns: {
      id: true,
      orderId: true,
      modeId: true,
      temperature: true,
      timeA: true,
      timeB: true,
      timeC: true,
    },
    with: {
      mode: true,
    },
    where: (fields, operators) => operators.eq(fields.orderId, orderId),
    // where: whereClause, // <-- Use this to re-enable temperature filtering
  });

  return context.json(temperatureProfiles, HttpStatusCodes.OK);
};

// ======================================================================== //

export const list__V1: AppRouteHandler<ListRoute> = async (context) => {
  // Parse temperature filter from query params
  const temperatureParam = context.req.query('temperature[$in]');
  const temperatures = temperatureParam
    ?.split(',')
    .map(Number)
    .filter((t) => !Number.isNaN(t));

  const temperatureProfiles = await db.query.temperature_profiles.findMany({
    columns: {
      id: true,
      orderId: true,
      modeId: true,
      temperature: true,
      timeA: true,
      timeB: true,
      timeC: true,
    },
    with: {
      mode: true,
    },
    where: temperatures?.length
      ? (fields, operators) => operators.inArray(fields.temperature, temperatures)
      : undefined,
  });

  const mapped = temperatureProfiles.map((tp) => ({
    ...tp,
    mode: tp.mode,
  }));

  return context.json(mapped);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const temperatureProfile = await db.query.temperature_profiles.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
    with: {
      mode: true,
    },
  });

  if (!temperatureProfile) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return context.json(temperatureProfile, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateRoute> = async (context) => {
  try {
    // Validate the request body (assumes Zod schema does NOT require 'id' for creation)
    const temperatureProfile = context.req.valid('json');

    // Validate mode exists
    const mode = await db.query.modes.findFirst({
      where: (fields, operators) => operators.eq(fields.id, temperatureProfile.modeId),
    });
    if (!mode) {
      return context.json(
        {
          success: false,
          error: {
            issues: [
              {
                code: 'INVALID_REFERENCE',
                path: ['modeId'],
                message: 'Invalid mode ID',
              },
            ],
            name: 'ValidationError',
          },
        },
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
      );
    }

    // Validate order exists
    const order = await db.query.orders.findFirst({
      where: (fields, operators) => operators.eq(fields.id, temperatureProfile.orderId),
    });
    if (!order) {
      return context.json(
        {
          success: false,
          error: {
            issues: [
              {
                code: 'INVALID_REFERENCE',
                path: ['orderId'],
                message: 'Invalid order ID',
              },
            ],
            name: 'ValidationError',
          },
        },
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
      );
    }

    // Insert the new temperature profile (id will be auto-generated by DB)
    const [inserted] = await db.insert(temperature_profiles).values(temperatureProfile).returning();

    return context.json(inserted, HttpStatusCodes.OK);
  } catch (error) {
    console.error('Failed to create temperature profile:', error);
    throw error;
  }
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

  const [temperatureProfile] = await db
    .update(temperature_profiles)
    .set(updates)
    .where(eq(temperature_profiles.id, id))
    .returning();

  if (!temperatureProfile) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return context.json(temperatureProfile, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const result = await db.delete(temperature_profiles).where(eq(temperature_profiles.id, id));

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

export const getByTemperature: AppRouteHandler<GetByTemperatureRoute> = async (context) => {
  const { temperature } = context.req.valid('param');

  // Find the closest matching temperature profile
  const temperatureProfile = await db.query.temperature_profiles.findFirst({
    where: (fields, operators) => {
      return operators.eq(fields.temperature, temperature);
    },
    orderBy: (fields, operators) => [operators.asc(fields.temperature)],
    with: {
      mode: true,
    },
  });

  if (!temperatureProfile) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return context.json(temperatureProfile, HttpStatusCodes.OK);
};

export const getMinMax: AppRouteHandler<GetMinMaxRoute> = async (context) => {
  const result = await db
    .select({
      min: min(temperature_profiles.temperature),
      max: max(temperature_profiles.temperature),
    })
    .from(temperature_profiles);

  // Handle case where table might be empty or has null values
  if (!result[0] || result[0].min === null || result[0].max === null) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  // At this point, we know min and max are numbers
  return context.json(
    {
      min: result[0].min,
      max: result[0].max,
    },
    HttpStatusCodes.OK,
  );
};
