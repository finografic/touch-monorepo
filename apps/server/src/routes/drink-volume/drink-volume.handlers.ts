import type { AppRouteHandler } from 'types/app.types';
import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from './drink-volume.routes';
import { db } from 'db';
import { volumes } from 'db/schemas/volumes.schema';
import { eq } from 'drizzle-orm';
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from 'lib/constants';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';

export const list: AppRouteHandler<ListRoute> = async (context) => {
  const drinkVolumes = await db.query.volumes.findMany({
    where: (fields, operators) => operators.eq(fields.isActive, true),
    columns: {
      id: true,
      name: true,
      nameEn: true,
      nameEs: true,
      nameCat: true,
      valueInMl: true,
      sortOrder: true,
      coolingFactor: true,
      isActive: true,
    },
  });
  return context.json(drinkVolumes);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const drinkVolume = await db.query.volumes.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!drinkVolume) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return context.json(drinkVolume, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateRoute> = async (context) => {
  const drinkVolume = context.req.valid('json');
  const [inserted] = await db.insert(volumes).values(drinkVolume).returning();
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

  const [drinkVolume] = await db.update(volumes).set(updates).where(eq(volumes.id, id)).returning();

  if (!drinkVolume) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return context.json(drinkVolume, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const result = await db.delete(volumes).where(eq(volumes.id, id));

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
