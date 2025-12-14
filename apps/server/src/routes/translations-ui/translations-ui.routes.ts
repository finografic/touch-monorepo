import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';

import { translationUiSchemas } from 'db/schemas/translations_ui.schema';
import { notFoundSchema } from 'lib/zod.errors';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';

const tags = ['TranslationsUi'];

export const list = createRoute({
  path: '/translations-ui',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(
        translationUiSchemas.select.pick({
          id: true,
          key: true,
          translations: true,
          description: true,
          isActive: true,
        }),
      ),
      'List of available UI translations',
    ),
  },
});

export const getOne = createRoute({
  path: '/translations-ui/{id}',
  method: 'get',
  request: {
    params: IdCuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(translationUiSchemas.select, 'The requested UI translation'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'UI translation not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error',
    ),
  },
});

export const create = createRoute({
  path: '/translations-ui',
  method: 'post',
  request: {
    body: jsonContentRequired(translationUiSchemas.insert, 'The UI translation to create'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(translationUiSchemas.select, 'The created UI translation'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(translationUiSchemas.insert),
      'The validation error(s)',
    ),
  },
});

export const patch = createRoute({
  path: '/translations-ui/{id}',
  method: 'patch',
  request: {
    params: IdCuidParamsSchema,
    body: jsonContentRequired(translationUiSchemas.patch, 'The UI translation updates'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(translationUiSchemas.select, 'The updated UI translation'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'UI translation not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(translationUiSchemas.patch).or(createErrorSchema(IdParamsSchema)),
      'The validation error(s)',
    ),
  },
});

export const remove = createRoute({
  path: '/translations-ui/{id}',
  method: 'delete',
  request: {
    params: IdCuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'UI translation deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'UI translation not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error',
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
