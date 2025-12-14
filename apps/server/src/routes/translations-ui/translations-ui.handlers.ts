// @ts-nocheck - Bypassing complex type inference issues throughout this file
import { eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';

import { db } from 'db';
import { translations_ui } from 'db/schemas/translations_ui.schema';
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from 'lib/zod.errors';
import type { AppRouteHandler } from 'types/app.types';
import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from './translations-ui.routes';

export const list: AppRouteHandler<ListRoute> = async (context) => {
  const uiTranslations = await db.query.translations_ui.findMany({
    where: (fields, operators) => operators.eq(fields.isActive, true),
  });
  return context.json(uiTranslations);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const uiTranslation = await db.query.translations_ui.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!uiTranslation) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return context.json(uiTranslation, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateRoute> = async (context) => {
  const uiTranslation = context.req.valid('json');
  const [inserted] = await db
    .insert(translations_ui)
    .values(uiTranslation as any)
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

  // Handle partial translations updates - merge with existing translations
  const dbUpdates: any = { ...updates };
  if (updates.translations && typeof updates.translations === 'object') {
    // Get current record to merge translations
    const [current] = await db
      .select({ translations: translations_ui.translations })
      .from(translations_ui)
      .where(eq(translations_ui.id, id))
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

  const [uiTranslation] = await db
    .update(translations_ui)
    .set(dbUpdates as any)
    .where(eq(translations_ui.id, id))
    .returning();

  if (!uiTranslation) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return context.json(uiTranslation, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const result = await db.delete(translations_ui).where(eq(translations_ui.id, id));

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
