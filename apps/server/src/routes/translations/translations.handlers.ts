// @ts-nocheck - Bypassing complex type inference issues throughout this file
import { eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';

import { db } from 'db';
import { translations_admin } from 'db/schemas/translations_admin.schema';
import { translations_app } from 'db/schemas/translations_app.schema';
import { translations_ui } from 'db/schemas/translations_ui.schema';
import { ERROR_CODES, ERROR_MESSAGES } from 'lib/valibot.errors';
import type { AppHandler } from 'types/app.types';

type TranslationNamespace = 'ui' | 'app' | 'admin';

// Helper to get the correct table based on namespace
function getTranslationTable(namespace: TranslationNamespace) {
  switch (namespace) {
    case 'ui':
      return translations_ui;
    case 'app':
      return translations_app;
    case 'admin':
      return translations_admin;
    default:
      throw new Error(`Invalid namespace: ${namespace}`);
  }
}

// Helper to get the correct query method based on namespace
function getTranslationQuery(namespace: TranslationNamespace) {
  switch (namespace) {
    case 'ui':
      return db.query.translations_ui;
    case 'app':
      return db.query.translations_app;
    case 'admin':
      return db.query.translations_admin;
    default:
      throw new Error(`Invalid namespace: ${namespace}`);
  }
}

export const list: AppHandler = async (context) => {
  const { namespace } = context.req.valid('param');
  const query = getTranslationQuery(namespace);

  const translations = await query.findMany({
    where: (fields, operators) => operators.eq(fields.isActive, true),
  });

  return context.json(translations);
};

export const getOne: AppHandler = async (context) => {
  const { id, namespace } = context.req.valid('param');
  const query = getTranslationQuery(namespace);

  const translation = await query.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!translation) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return context.json(translation, HttpStatusCodes.OK);
};

export const create: AppHandler = async (context) => {
  const { namespace } = context.req.valid('param');
  const translation = context.req.valid('json');
  const table = getTranslationTable(namespace);

  const [inserted] = await db
    .insert(table)
    .values(translation as any)
    .returning();

  return context.json(inserted, HttpStatusCodes.OK);
};

export const patch: AppHandler = async (context) => {
  const { id, namespace } = context.req.valid('param');
  const updates = context.req.valid('json');
  const table = getTranslationTable(namespace);

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
      .select({ translations: table.translations })
      .from(table)
      .where(eq(table.id, id))
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

  const [updatedTranslation] = await db
    .update(table)
    .set(dbUpdates as any)
    .where(eq(table.id, id))
    .returning();

  if (!updatedTranslation) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return context.json(updatedTranslation, HttpStatusCodes.OK);
};

export const remove: AppHandler = async (context) => {
  const { id, namespace } = context.req.valid('param');
  const table = getTranslationTable(namespace);

  const result = await db.delete(table).where(eq(table.id, id));

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
