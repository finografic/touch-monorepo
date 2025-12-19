import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';

import { translationUiSchemas } from 'db/schemas/translations_ui.schema';
import { notFoundSchema } from 'lib/zod.errors';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';

const tags = ['Translations'];

// Shared schema - all translation tables have the same structure
const translationSchema = translationUiSchemas;

export const list = createRoute({
  path: '/translations/{namespace}',
  method: 'get',
  request: {
    params: z.object({
      namespace: z.enum(['ui', 'app', 'admin']).describe('Translation namespace'),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(
        translationSchema.select.pick({
          id: true,
          key: true,
          translations: true,
          isActive: true,
        }),
      ),
      'List of available translations for the namespace',
    ),
  },
});

export const getOne = createRoute({
  path: '/translations/{namespace}/{id}',
  method: 'get',
  request: {
    params: IdCuidParamsSchema.extend({
      namespace: z.enum(['ui', 'app', 'admin']).describe('Translation namespace'),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(translationSchema.select, 'The requested translation'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Translation not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error',
    ),
  },
});

export const create = createRoute({
  path: '/translations/{namespace}',
  method: 'post',
  request: {
    params: z.object({
      namespace: z.enum(['ui', 'app', 'admin']).describe('Translation namespace'),
    }),
    body: jsonContentRequired(translationSchema.insert, 'The translation to create'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(translationSchema.select, 'The created translation'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(translationSchema.insert),
      'The validation error(s)',
    ),
  },
});

export const patch = createRoute({
  path: '/translations/{namespace}/{id}',
  method: 'patch',
  request: {
    params: IdCuidParamsSchema.extend({
      namespace: z.enum(['ui', 'app', 'admin']).describe('Translation namespace'),
    }),
    body: jsonContentRequired(translationSchema.patch, 'The translation updates'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(translationSchema.select, 'The updated translation'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Translation not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(translationSchema.patch).or(createErrorSchema(IdParamsSchema)),
      'The validation error(s)',
    ),
  },
});

export const remove = createRoute({
  path: '/translations/{namespace}/{id}',
  method: 'delete',
  request: {
    params: IdCuidParamsSchema.extend({
      namespace: z.enum(['ui', 'app', 'admin']).describe('Translation namespace'),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Translation deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Translation not found'),
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
