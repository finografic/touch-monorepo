import type { AppRouteHandler } from 'types/app.types';
import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from './drink-type.routes';
import { db } from 'db';
import { drink_types } from 'db/schemas';
import { eq } from 'drizzle-orm';
import type { InferModel } from 'drizzle-orm';
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from 'lib/constants';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';

// Simple formatter using object spreading - avoids type inference issues
type DrinkType = InferModel<typeof drink_types>;
function formatDrinkType(drinkType: DrinkType) {
  return {
    ...drinkType,
    createdAt: drinkType.createdAt?.toISOString() ?? null,
    updatedAt: drinkType.updatedAt?.toISOString() ?? null,
  };
}

export const list: AppRouteHandler<ListRoute> = async (context) => {
  const drinkTypes = await db.select().from(drink_types).where(eq(drink_types.isActive, true));
  return context.json((drinkTypes as any).map(formatDrinkType));
};

export const getOne: AppRouteHandler<GetOneRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const result = await db.select().from(drink_types).where(eq(drink_types.id, id)).limit(1);

  if ((result as any[]).length === 0) {
    return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return context.json(formatDrinkType((result as any[])[0]), HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateRoute> = async (context) => {
  const drinkType = context.req.valid('json');
  const result = await db.insert(drink_types).values(drinkType).returning();
  return context.json(formatDrinkType(result[0]), HttpStatusCodes.OK);
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

  const result = await db.update(drink_types).set(updates).where(eq(drink_types.id, id)).returning();

  if (result.length === 0) {
    return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return context.json(formatDrinkType(result[0]), HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const result = await db.delete(drink_types).where(eq(drink_types.id, id));

  if (result.changes === 0) {
    return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return context.body(null, HttpStatusCodes.NO_CONTENT);
};
