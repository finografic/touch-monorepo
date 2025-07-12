import type { AppRouteHandler } from 'types/app.types';
import type {
  CreateRoute,
  GetOneRoute,
  ListRoute,
  PatchRoute,
  RemoveRoute,
} from './supported-language.routes';
import { db } from 'db';
import { supported_languages } from 'db/schemas/supported_languages.schema';
import { eq } from 'drizzle-orm';
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from 'lib/constants';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import {
  createTranslationColumns,
  removeTranslationColumns,
  translateLanguageInBackground,
  // validateLanguageCode,
} from 'utils/translation-columns.utils';
import { convertBooleansToIntegers } from 'lib/zod-utils';
import type { InferInsertModel } from 'drizzle-orm';
// import { autoTranslateExistingContent } from 'utils/auto-translate.utils';

export const list: AppRouteHandler<ListRoute> = async (context) => {
  const supportedLanguages = await db.query.supported_languages.findMany({
    columns: {
      id: true,
      isoCode: true,
      nativeName: true,
      displayName: true,
      flagCode: true,
      isActive: true,
      isDefault: true,
      sortOrder: true,
    },
    orderBy: (fields, operators) => [
      operators.desc(fields.isDefault), // Default language first
      operators.asc(fields.sortOrder), // Then by sort order
      operators.asc(fields.displayName), // Finally by display name
    ],
  });
  // Convert isActive and isDefault to booleans for the API response
  const mapped = supportedLanguages.map((lang) => ({
    ...lang,
    isActive: Boolean(lang.isActive),
    isDefault: Boolean(lang.isDefault),
  }));
  return context.json(mapped);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const supportedLanguage = await db.query.supported_languages.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!supportedLanguage) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return context.json(supportedLanguage, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateRoute> = async (context) => {
  const supportedLanguage = context.req.valid('json');

  try {
    // Get the highest sort_order and increment by 1
    const maxSortOrder = await db.query.supported_languages.findFirst({
      columns: { sortOrder: true },
      orderBy: (fields, operators) => [operators.desc(fields.sortOrder)],
    });

    const nextSortOrder = (maxSortOrder?.sortOrder || 0) + 1;

    // Convert booleans to integers for DB
    const { isoCode, nativeName, displayName, flagCode, isActive, isDefault } = supportedLanguage;
    const dbValues = convertBooleansToIntegers(
      { isoCode, nativeName, displayName, flagCode, isActive, isDefault, sortOrder: nextSortOrder },
      ['isActive', 'isDefault'],
    ) as InferInsertModel<typeof supported_languages>;

    // Insert the new language with auto-incremented sort_order
    const [inserted] = await db.insert(supported_languages).values(dbValues).returning();

    // Create translation columns for all translatable entities (FAST)
    await createTranslationColumns(supportedLanguage.isoCode);

    console.log(
      `✅ Successfully created language ${supportedLanguage.isoCode} with translation columns (sort_order: ${nextSortOrder})`,
    );

    // Start background translation (non-blocking)
    // This runs in the background and doesn't block the response
    setImmediate(async () => {
      try {
        console.log(`🔄 Starting background translation for ${supportedLanguage.isoCode}...`);
        await translateLanguageInBackground(supportedLanguage.isoCode);
        console.log(`🎉 Background translation completed for ${supportedLanguage.isoCode}`);
      } catch (error) {
        console.error(`❌ Background translation failed for ${supportedLanguage.isoCode}:`, error);
        // In a real app, you might want to:
        // - Update a status field in the database
        // - Send a notification to admins
        // - Emit a WebSocket event to update the UI
      }
    });

    // Return immediately while translation happens in background
    return context.json(
      {
        ...inserted,
        isActive: Boolean(inserted.isActive),
        isDefault: Boolean(inserted.isDefault),
      },
      HttpStatusCodes.OK,
    );
  } catch (error) {
    console.error('Error creating supported language:', error);
    throw error; // Let the framework handle the error response
  }
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

  // Convert to integers for DB if present
  const dbUpdates = convertBooleansToIntegers(updates, ['isActive', 'isDefault']);

  const [supportedLanguage] = await db
    .update(supported_languages)
    .set(dbUpdates)
    .where(eq(supported_languages.id, id))
    .returning();

  if (!supportedLanguage) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  // Convert isActive and isDefault to booleans for the API response
  const mapped = {
    ...supportedLanguage,
    isActive: Boolean(supportedLanguage.isActive),
    isDefault: Boolean(supportedLanguage.isDefault),
  };

  return context.json(mapped, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (context) => {
  const { id } = context.req.valid('param');

  // First, check if the language exists and if it's the default language
  const languageToDelete = await db.query.supported_languages.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
    columns: {
      id: true,
      isDefault: true,
      displayName: true,
      isoCode: true,
    },
  });

  if (!languageToDelete) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  // Prevent deletion of the default language
  if (languageToDelete.isDefault) {
    return context.json(
      {
        message: 'Cannot delete the default language. Please set another language as default first.',
        details: {
          languageCode: languageToDelete.isoCode,
          displayName: languageToDelete.displayName,
          reason: 'DEFAULT_LANGUAGE_PROTECTION',
        },
      },
      HttpStatusCodes.FORBIDDEN,
    );
  }

  try {
    // Delete the language from database
    const result = await db.delete(supported_languages).where(eq(supported_languages.id, id));

    if (result.changes === 0) {
      return context.json(
        {
          message: HttpStatusPhrases.NOT_FOUND,
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    // Remove translation columns for this language from all translatable tables
    await removeTranslationColumns(languageToDelete.isoCode);

    console.log(
      `✅ Successfully deleted language ${languageToDelete.isoCode} and removed translation columns`,
    );

    return context.body(null, HttpStatusCodes.NO_CONTENT);
  } catch (error) {
    console.error('Error deleting supported language and translation columns:', error);
    throw error; // Let the framework handle the error response
  }
};
