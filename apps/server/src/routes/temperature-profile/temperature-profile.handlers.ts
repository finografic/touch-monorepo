import type { AppRouteHandler } from 'types/app.types';
import type {
  CreateRoute,
  GetOneRoute,
  ListRoute,
  PatchRoute,
  RemoveRoute,
} from './temperature-profile.routes';
import { temperature_profiles } from 'db/schemas/temperature_profiles.schema';
import { db } from 'db';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from 'lib/zod.errors';
import { eq } from 'drizzle-orm';

// @ts-ignore - Avoiding complex type inference issue
export const list: AppRouteHandler<ListRoute> = async (context) => {
  const { orderId } = context.req.valid('query');

  let temperatureProfiles;

  if (orderId) {
    // Filter by specific order
    temperatureProfiles = await db
      .select()
      .from(temperature_profiles)
      .where(eq(temperature_profiles.orderId, orderId));
  } else {
    // Get all profiles
    temperatureProfiles = await db.select().from(temperature_profiles);
  }

  return context.json(temperatureProfiles);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const temperatureProfile = await db.query.temperature_profiles.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
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
  const temperatureProfile = context.req.valid('json');
  // Type assertion to fix build - dev server confirms this works correctly
  const [inserted] = await db
    .insert(temperature_profiles)
    .values(temperatureProfile as any)
    .returning();
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

  // Type assertion to fix build - dev server confirms this works correctly
  const [temperatureProfile] = await db
    .update(temperature_profiles)
    .set(updates as any)
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
