import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';

import { supportedLanguageSchemas } from 'db/schemas/supported_languages.schema';
import { notFoundSchema } from 'lib/zod.errors';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';

const tags = ['SupportedLanguages'];

export const list = createRoute({
  path: '/supported-languages',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(
        supportedLanguageSchemas.select.pick({
          id: true,
          isoCode: true,
          nativeName: true,
          displayName: true,
          flagCode: true,
          isActive: true,
          sortOrder: true,
        }),
      ),
      'List of available supported languages',
    ),
  },
});

export const getOne = createRoute({
  path: '/supported-languages/{id}',
  method: 'get',
  request: {
    params: IdCuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(supportedLanguageSchemas.select, 'The requested supported language'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Supported language not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error',
    ),
  },
});

export const create = createRoute({
  path: '/supported-languages',
  method: 'post',
  request: {
    body: jsonContentRequired(supportedLanguageSchemas.insert, 'The supported language to create'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(supportedLanguageSchemas.select, 'The created supported language'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(supportedLanguageSchemas.insert),
      'The validation error(s)',
    ),
  },
});

export const patch = createRoute({
  path: '/supported-languages/{id}',
  method: 'patch',
  request: {
    params: IdCuidParamsSchema,
    body: jsonContentRequired(supportedLanguageSchemas.patch, 'The supported language updates'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(supportedLanguageSchemas.select, 'The updated supported language'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Supported language not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(supportedLanguageSchemas.patch).or(createErrorSchema(IdParamsSchema)),
      'The validation error(s)',
    ),
  },
});

// export const remove = createRoute({
//   path: '/supported-languages/{id}',
//   method: 'delete',
//   request: {
//     params: IdCuidParamsSchema,
//   },
//   tags,
//   responses: {
//     [HttpStatusCodes.NO_CONTENT]: {
//       description: 'Supported language deleted',
//     },
//     [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Supported language not found'),
//     [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
//       createErrorSchema(IdParamsSchema),
//       'Invalid id error',
//     ),
//   },
// });

export const remove = createRoute({
  path: '/supported-languages/{id}',
  method: 'delete',
  request: {
    params: IdCuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Supported language deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Supported language not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error',
    ),
  },
});

export const getTranslationStatus = createRoute({
  path: '/supported-languages/{isoCode}/translation-status',
  method: 'get',
  request: {
    params: z.object({
      isoCode: z.string().describe('ISO language code (e.g., pt-BR)'),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        status: z.enum(['pending', 'in-progress', 'completed', 'failed']),
        startedAt: z.string().datetime(),
        completedAt: z.string().datetime().optional(),
        error: z.string().optional(),
        progress: z
          .object({
            currentTable: z.string(),
            totalTables: z.number(),
            completedTables: z.number(),
          })
          .optional(),
      }),
      'Translation status for the language',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({ message: z.string() }),
      'Translation status not found (translation may not have started)',
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
export type GetTranslationStatusRoute = typeof getTranslationStatus;
