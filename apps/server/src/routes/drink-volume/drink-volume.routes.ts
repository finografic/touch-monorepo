import { createRoute, z } from '@hono/zod-openapi';
import { volumeSchemas } from 'db/schemas/volumes.schema';
import { notFoundSchema } from 'lib/constants';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';

const tags = ['DrinkVolumes'];

export const list = createRoute({
  path: '/drink-volumes',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(
        volumeSchemas.select.pick({
          id: true,
          name: true,
          translations: true,
          valueInMl: true,
          sortOrder: true,
          coolingFactor: true,
          isActive: true,
        }),
      ),
      'List of available drink volumes',
    ),
  },
});

export const getOne = createRoute({
  path: '/drink-volumes/{id}',
  method: 'get',
  request: {
    params: IdCuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(volumeSchemas.select, 'The requested drink volume'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Drink volume not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error',
    ),
  },
});

export const create = createRoute({
  path: '/drink-volumes',
  method: 'post',
  request: {
    body: jsonContentRequired(volumeSchemas.insert, 'The drink volume to create'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(volumeSchemas.select, 'The created drink volume'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(volumeSchemas.insert),
      'The validation error(s)',
    ),
  },
});

export const patch = createRoute({
  path: '/drink-volumes/{id}',
  method: 'patch',
  request: {
    params: IdCuidParamsSchema,
    body: jsonContentRequired(volumeSchemas.patch, 'The drink volume updates'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(volumeSchemas.select, 'The updated drink volume'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Drink volume not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(volumeSchemas.patch).or(createErrorSchema(IdParamsSchema)),
      'The validation error(s)',
    ),
  },
});

export const remove = createRoute({
  path: '/drink-volumes/{id}',
  method: 'delete',
  request: {
    params: IdCuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Drink volume deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Drink volume not found'),
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
