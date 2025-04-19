import type { AppRouteHandler } from 'types/app.types';
import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from './drink-type.routes';
import { db } from 'db';
import { drink_types } from 'db/schemas';
import { eq } from 'drizzle-orm';
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from 'lib/constants';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';

export const list: AppRouteHandler<ListRoute> = async (context) => {
  const drinkTypes = await db.query.drink_types.findMany({
    where: (fields, operators) => operators.eq(fields.isActive, true),
    columns: {
      id: true,
      displayName: true,
      defaultConsumptionTemp: true,
      hasSubtypes: true,
      isActive: true,
    },
  });
  return context.json(drinkTypes);
};

export const create: AppRouteHandler<CreateRoute> = async (context) => {
  const drinkType = context.req.valid('json');
  const [inserted] = await db.insert(drink_types).values(drinkType).returning();
  return context.json(inserted, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const drinkType = await db.query.drink_types.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!drinkType) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return context.json(drinkType, HttpStatusCodes.OK);
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

  const [drinkType] = await db.update(drink_types).set(updates).where(eq(drink_types.id, id)).returning();

  if (!drinkType) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return context.json(drinkType, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const result = await db.delete(drink_types).where(eq(drink_types.id, id));

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
