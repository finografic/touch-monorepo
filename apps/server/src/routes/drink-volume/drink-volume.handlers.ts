// @ts-nocheck
import { eq } from 'drizzle-orm';
import { StatusCodes as HttpStatusCodes, ReasonPhrases as HttpStatusPhrases } from 'http-status-codes';

import { db } from 'db';
import { volumes } from 'db/schemas/volumes.schema';
import { ERROR_CODES, ERROR_MESSAGES } from 'lib/valibot.errors';
import type { AppHandler } from 'types/app.types';

export const list: AppHandler = async (context) => {
  const drinkVolumes = await db.query.volumes.findMany({
    where: (fields, operators) => operators.eq(fields.isActive, true),
  });
  return context.json(drinkVolumes);
};

export const getOne: AppHandler = async (context) => {
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

export const create: AppHandler = async (context) => {
  const drinkVolume = context.req.valid('json');
  const [inserted] = await db
    .insert(volumes)
    .values(drinkVolume as any)
    .returning();
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

  // Handle partial translations updates - merge with existing translations
  const dbUpdates: any = { ...updates };
  if (updates.translations && typeof updates.translations === 'object') {
    // Get current record to merge translations
    const [current] = await db
      .select({ translations: volumes.translations })
      .from(volumes)
      .where(eq(volumes.id, id))
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

  const [drinkVolume] = await db
    .update(volumes)
    .set(dbUpdates as any)
    .where(eq(volumes.id, id))
    .returning();

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

export const remove: AppHandler = async (context) => {
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
