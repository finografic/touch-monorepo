import { createRoute, z } from '@hono/zod-openapi';
import { modeSchemas } from 'db/schemas/modes.schema';
import { notFoundSchema } from 'lib/constants';
import { IdUuidParamsSchema } from 'schemas/id-uuid-params.schema';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema } from 'stoker/openapi/schemas';

const tags = ['CoolingProfiles'];

export const list = createRoute({
  path: '/modes',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(modeSchemas.select), 'The list of cooling profiles'),
  },
});

export const getOne = createRoute({
  path: '/modes/{id}',
  method: 'get',
  request: {
    params: IdUuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(modeSchemas.select, 'The requested cooling profile'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Cooling profile not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdUuidParamsSchema), 'Invalid id'),
  },
});

export const create = createRoute({
  path: '/modes',
  method: 'post',
  request: {
    body: jsonContentRequired(modeSchemas.insert, 'The cooling profile to create'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(modeSchemas.select, 'The created cooling profile'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(modeSchemas.insert),
      'The validation error(s)',
    ),
  },
});

export const patch = createRoute({
  path: '/modes/{id}',
  method: 'patch',
  request: {
    params: IdUuidParamsSchema,
    body: jsonContentRequired(modeSchemas.patch, 'The cooling profile updates'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(modeSchemas.select, 'The updated cooling profile'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Cooling profile not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(modeSchemas.patch).or(createErrorSchema(IdUuidParamsSchema)),
      'The validation error(s)',
    ),
  },
});

export const remove = createRoute({
  path: '/modes/{id}',
  method: 'delete',
  request: {
    params: IdUuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Cooling profile deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Cooling profile not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdUuidParamsSchema), 'Invalid id'),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
