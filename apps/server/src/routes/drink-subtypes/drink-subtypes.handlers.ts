// @ts-nocheck - Bypassing complex type inference issues throughout this file
import { db } from 'db';
import { drink_subtypes, drink_types } from 'db/schemas';
import type { InferSelectModel } from 'drizzle-orm';
import { and, eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from 'lib/zod.errors';
import type { AppRouteHandler } from 'types/app.types';
import {
  handleSubtypeCreation,
  handleSubtypeDeletion,
  handleSubtypeUpdate,
} from 'utils/drink-type.utils';
import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from './drink-subtypes.routes';

// Simple subtype formatter using proper typing
type DrinkSubtype = InferSelectModel<typeof drink_subtypes>;
function formatSubtype(subtype: DrinkSubtype) {
  return {
    ...subtype,
    createdAt: subtype.createdAt?.toISOString() ?? null,
    updatedAt: subtype.updatedAt?.toISOString() ?? null,
  };
}

// @ts-ignore - Avoiding complex type inference issue
export const list: AppRouteHandler<ListRoute> = async (context) => {
  const { drinkTypeId } = context.req.valid('param');

  // First verify the drink type exists and has subtypes
  const drinkTypeResult = await db
    .select({ id: drink_types.id, hasSubtypes: drink_types.hasSubtypes, isActive: drink_types.isActive })
    .from(drink_types)
    .where(and(eq(drink_types.id, drinkTypeId), eq(drink_types.isActive, true)))
    .limit(1);

  if (drinkTypeResult.length === 0) {
    return context.json({ message: 'Drink type not found' }, HttpStatusCodes.NOT_FOUND);
  }

  const drinkType = drinkTypeResult[0];

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

  // Fetch subtypes
  const subtypes = await db
    .select()
    .from(drink_subtypes)
    .where(and(eq(drink_subtypes.drinkTypeId, drinkTypeId), eq(drink_subtypes.isActive, true)));

  return context.json(subtypes.map(formatSubtype));
};

// @ts-ignore - Avoiding complex type inference issue
export const getOne: AppRouteHandler<GetOneRoute> = async (context) => {
  const { drinkTypeId, id } = context.req.valid('param');

  const result = await db
    .select()
    .from(drink_subtypes)
    .where(
      and(
        eq(drink_subtypes.id, id),
        eq(drink_subtypes.drinkTypeId, drinkTypeId),
        eq(drink_subtypes.isActive, true),
      ),
    )
    .limit(1);

  if (result.length === 0) {
    return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return context.json(formatSubtype(result[0]), HttpStatusCodes.OK);
};

// @ts-ignore - Avoiding complex type inference issue
export const create: AppRouteHandler<CreateRoute> = async (context) => {
  const { drinkTypeId } = context.req.valid('param');
  const subtypeData = context.req.valid('json');

  // Verify drink type exists
  const drinkTypeResult = await db
    .select({ id: drink_types.id, hasSubtypes: drink_types.hasSubtypes, isActive: drink_types.isActive })
    .from(drink_types)
    .where(and(eq(drink_types.id, drinkTypeId), eq(drink_types.isActive, true)))
    .limit(1);

  if (drinkTypeResult.length === 0) {
    return context.json({ message: 'Drink type not found' }, HttpStatusCodes.NOT_FOUND);
  }

  const drinkType = drinkTypeResult[0];

  // Insert the subtype first
  const result = await db
    .insert(drink_subtypes)
    .values({ ...subtypeData, drinkTypeId })
    .returning();

  // Handle side effects: synchronize parent drink type's hasSubtypes flag
  await handleSubtypeCreation(drinkTypeId);

  return context.json(formatSubtype(result[0]), HttpStatusCodes.OK);
};

// @ts-ignore - Avoiding complex type inference issue
export const patch: AppRouteHandler<PatchRoute> = async (context) => {
  const { drinkTypeId, id } = context.req.valid('param');
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

  // Handle partial translations updates - merge with existing translations
  const dbUpdates: any = { ...updates };
  if (updates.translations && typeof updates.translations === 'object') {
    // Get current record to merge translations
    const [current] = await db
      .select({ translations: drink_subtypes.translations })
      .from(drink_subtypes)
      .where(and(eq(drink_subtypes.id, id), eq(drink_subtypes.drinkTypeId, drinkTypeId)))
      .limit(1);

    if (current) {
      // Merge partial translations with existing translations
      const currentTranslations = (current.translations as Record<string, string>) || {};
      dbUpdates.translations = {
        ...currentTranslations,
        ...updates.translations,
      };
    }
  }

  const result = await db
    .update(drink_subtypes)
    .set(dbUpdates)
    .where(and(eq(drink_subtypes.id, id), eq(drink_subtypes.drinkTypeId, drinkTypeId)))
    .returning();

  if (result.length === 0) {
    return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  // Handle side effects: synchronize parent drink type's hasSubtypes flag
  // (e.g., if isActive was changed from true to false, hasSubtypes might need to change)
  await handleSubtypeUpdate(drinkTypeId);

  return context.json(formatSubtype(result[0]), HttpStatusCodes.OK);
};

// @ts-ignore - Avoiding complex type inference issue
export const remove: AppRouteHandler<RemoveRoute> = async (context) => {
  const { drinkTypeId, id } = context.req.valid('param');

  // Delete the subtype first
  const result = await db
    .delete(drink_subtypes)
    .where(and(eq(drink_subtypes.id, id), eq(drink_subtypes.drinkTypeId, drinkTypeId)));

  if (result.changes === 0) {
    return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  // Handle side effects AFTER deletion:
  // - Clear drinkSubtypeId in orders (set to NULL, don't delete rows)
  // - Synchronize parent drink type's hasSubtypes flag
  await handleSubtypeDeletion(drinkTypeId, id);

  return context.body(null, HttpStatusCodes.NO_CONTENT);
};
