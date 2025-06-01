import type { AppRouteHandler } from 'types/app.types';
import type {
  CreateRoute,
  GetMinMaxRoute,
  GetOneRoute,
  ListRoute,
  PatchRoute,
  RemoveRoute,
} from './temperature.routes';
import { temperature_profiles } from 'db/schemas';
import { db } from 'db';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from 'lib/constants';
import { eq, max, min } from 'drizzle-orm';

export const list: AppRouteHandler<ListRoute> = async (context) => {
  const temperatureProfiles = await db.query.temperature_profiles.findMany({
    columns: {
      id: true,
      temperature: true,
      timeA: true,
      timeB: true,
      timeC: true,
    },
  });
  return context.json(temperatureProfiles);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const temperatureProfile = await db.query.temperature_profiles.findFirst({
    where: (fields, operators) => operators.eq(fields.id, id),
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
  const [inserted] = await db.insert(temperature_profiles).values(temperatureProfile).returning();
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

export const getMinMax: AppRouteHandler<GetMinMaxRoute> = async (context) => {
  const result = await db
    .select({
      min: min(temperature_profiles.temperature),
      max: max(temperature_profiles.temperature),
    })
    .from(temperature_profiles);

  // Handle case where table might be empty
  if (!result[0] || result[0].min === null || result[0].max === null) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return context.json({
    min: result[0].min,
    max: result[0].max,
  });
};
