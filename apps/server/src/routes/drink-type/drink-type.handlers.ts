import type { AppRouteHandler } from 'types/app.types';
import type {
  CreateRoute,
  GetOneRoute,
  GetSubtypesRoute,
  ListRoute,
  PatchRoute,
  RemoveRoute,
} from './drink-type.routes';
import { db } from 'db';
import { drink_subtypes, drink_types } from 'db/schemas';
import { eq } from 'drizzle-orm';
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from 'lib/constants';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';

export const list: AppRouteHandler<ListRoute> = async (context) => {
  const drinkTypes = await db.query.drink_types.findMany({
    where: (fields, operators) => operators.eq(fields.isActive, true),
  });

  // Manual transformation to avoid infinite type recursion
  const formattedDrinkTypes = [];
  for (const drinkType of drinkTypes) {
    formattedDrinkTypes.push({
      id: drinkType.id,
      name: drinkType.name,
      name_es_es: drinkType.name_es_es,
      name_en_gb: drinkType.name_en_gb,
      name_ca_es: drinkType.name_ca_es,
      translations: drinkType.translations,
      hasSubtypes: drinkType.hasSubtypes,
      defaultTempConsume: drinkType.defaultTempConsume,
      defaultTempFreeze: drinkType.defaultTempFreeze,
      isActive: drinkType.isActive,
      createdAt: drinkType.createdAt?.toISOString() ?? null,
      updatedAt: drinkType.updatedAt?.toISOString() ?? null,
    });
  }

  return context.json(formattedDrinkTypes);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const drinkType = await db.query.drink_types.findFirst({
    where: (fields, operators) => operators.eq(fields.id, id),
  });

  if (!drinkType) {
    return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return context.json(
    {
      id: drinkType.id,
      name: drinkType.name,
      name_es_es: drinkType.name_es_es,
      name_en_gb: drinkType.name_en_gb,
      name_ca_es: drinkType.name_ca_es,
      translations: drinkType.translations,
      hasSubtypes: drinkType.hasSubtypes,
      defaultTempConsume: drinkType.defaultTempConsume,
      defaultTempFreeze: drinkType.defaultTempFreeze,
      isActive: drinkType.isActive,
      createdAt: drinkType.createdAt?.toISOString() ?? null,
      updatedAt: drinkType.updatedAt?.toISOString() ?? null,
    },
    HttpStatusCodes.OK,
  );
};

export const getSubtypes: AppRouteHandler<GetSubtypesRoute> = async (context) => {
  const { id } = context.req.valid('param');

  // First check if the drink type exists and has subtypes
  const drinkType = await db.query.drink_types.findFirst({
    where: (fields, operators) =>
      operators.and(operators.eq(fields.id, id), operators.eq(fields.isActive, true)),
  });

  if (!drinkType) {
    return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  if (!drinkType.hasSubtypes) {
    return context.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: ['hasSubtypes'],
              message: 'This drink type does not have subtypes',
            },
          ],
          name: 'ZodError',
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  // Fetch active subtypes for this drink type
  const subtypes = await db.query.drink_subtypes.findMany({
    where: (fields, operators) =>
      operators.and(operators.eq(fields.drinkTypeId, id), operators.eq(fields.isActive, true)),
  });

  // Manual transformation for subtypes
  const formattedSubtypes = [];
  for (const subtype of subtypes) {
    formattedSubtypes.push({
      id: subtype.id,
      name: subtype.name,
      name_es_es: subtype.name_es_es,
      name_en_gb: subtype.name_en_gb,
      name_ca_es: subtype.name_ca_es,
      translations: subtype.translations,
      drinkTypeId: subtype.drinkTypeId,
      defaultTempConsume: subtype.defaultTempConsume,
      defaultTempFreeze: subtype.defaultTempFreeze,
      isActive: subtype.isActive,
      createdAt: subtype.createdAt?.toISOString() ?? null,
      updatedAt: subtype.updatedAt?.toISOString() ?? null,
    });
  }

  return context.json(formattedSubtypes, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateRoute> = async (context) => {
  const drinkType = context.req.valid('json');
  const [inserted] = await db.insert(drink_types).values(drinkType).returning();

  return context.json(
    {
      id: inserted.id,
      name: inserted.name,
      name_es_es: inserted.name_es_es,
      name_en_gb: inserted.name_en_gb,
      name_ca_es: inserted.name_ca_es,
      translations: inserted.translations,
      hasSubtypes: inserted.hasSubtypes,
      defaultTempConsume: inserted.defaultTempConsume,
      defaultTempFreeze: inserted.defaultTempFreeze,
      isActive: inserted.isActive,
      createdAt: inserted.createdAt?.toISOString() ?? null,
      updatedAt: inserted.updatedAt?.toISOString() ?? null,
    },
    HttpStatusCodes.OK,
  );
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
    return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return context.json(
    {
      id: drinkType.id,
      name: drinkType.name,
      name_es_es: drinkType.name_es_es,
      name_en_gb: drinkType.name_en_gb,
      name_ca_es: drinkType.name_ca_es,
      translations: drinkType.translations,
      hasSubtypes: drinkType.hasSubtypes,
      defaultTempConsume: drinkType.defaultTempConsume,
      defaultTempFreeze: drinkType.defaultTempFreeze,
      isActive: drinkType.isActive,
      createdAt: drinkType.createdAt?.toISOString() ?? null,
      updatedAt: drinkType.updatedAt?.toISOString() ?? null,
    },
    HttpStatusCodes.OK,
  );
};

export const remove: AppRouteHandler<RemoveRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const result = await db.delete(drink_types).where(eq(drink_types.id, id));

  if (result.changes === 0) {
    return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return context.body(null, HttpStatusCodes.NO_CONTENT);
};
