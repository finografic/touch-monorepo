import * as v from 'valibot';
import { StatusCodes as HttpStatusCodes } from 'http-status-codes';

import { supportedLanguageSchemas } from 'db/schemas/supported_languages.schema';
import { json, jsonRequired, route } from 'lib/openapi.helpers';
import { notFoundSchema, validationErrorSchema } from 'lib/valibot.errors';

const tags = ['SupportedLanguages'];

export const list = route('/supported-languages', {
  tags,
  description: 'List of available supported languages',
  responses: {
    [HttpStatusCodes.OK]: json(
      v.array(
        v.pick(supportedLanguageSchemas.select, [
          'id',
          'isoCode',
          'nativeName',
          'displayName',
          'flagCode',
          'isActive',
          'sortOrder',
        ]),
      ),
      'List of available supported languages',
    ),
  },
});

export const getOne = route('/supported-languages/:id', {
  tags,
  description: 'Get a single supported language by id',
  responses: {
    [HttpStatusCodes.OK]:                   json(supportedLanguageSchemas.select, 'The requested supported language'),
    [HttpStatusCodes.NOT_FOUND]:            json(notFoundSchema, 'Supported language not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid id error'),
  },
});

export const create = route('/supported-languages', {
  tags,
  description: 'Create a new supported language',
  responses: {
    [HttpStatusCodes.OK]:                   json(supportedLanguageSchemas.select, 'The created supported language'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const patch = route('/supported-languages/:id', {
  tags,
  description: 'Update a supported language',
  responses: {
    [HttpStatusCodes.OK]:                   json(supportedLanguageSchemas.select, 'The updated supported language'),
    [HttpStatusCodes.NOT_FOUND]:            json(notFoundSchema, 'Supported language not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const remove = route('/supported-languages/:id', {
  tags,
  description: 'Delete a supported language',
  responses: {
    [HttpStatusCodes.NO_CONTENT]: { description: 'Supported language deleted' },
    [HttpStatusCodes.NOT_FOUND]:  json(notFoundSchema, 'Supported language not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid id error'),
  },
});

export const getTranslationStatus = route('/supported-languages/:isoCode/translation-status', {
  tags,
  description: 'Get translation status for a language',
  responses: {
    [HttpStatusCodes.OK]: json(
      v.object({
        status:      v.picklist(['pending', 'in-progress', 'completed', 'failed']),
        startedAt:   v.string(),
        completedAt: v.optional(v.string()),
        error:       v.optional(v.string()),
        progress:    v.optional(
          v.object({
            currentTable:    v.string(),
            totalTables:     v.number(),
            completedTables: v.number(),
          }),
        ),
      }),
      'Translation status for the language',
    ),
    [HttpStatusCodes.NOT_FOUND]: json(
      v.object({ message: v.string() }),
      'Translation status not found (translation may not have started)',
    ),
  },
});
