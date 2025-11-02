import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { temperatureProfileSchemas } from 'db/schemas/temperature_profiles.schema';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { notFoundSchema } from 'lib/zod.errors';
import { IdUuidParamsSchema } from 'schemas/id-uuid-params.schema';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';

const tags = ['TemperatureProfile'];

export const list = createRoute({
  path: '/temperature-profiles',
  method: 'get',
  tags,
  request: {
    query: z.object({
      orderId: z.string().optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(temperatureProfileSchemas.select),
      'List of available temperature profiles',
    ),
  },
});

export const getOne = createRoute({
  path: '/temperature-profiles/{id}',
  method: 'get',
  request: {
    params: IdUuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(temperatureProfileSchemas.select, 'The requested temperature profile'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Temperature profile not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error',
    ),
  },
});

export const create = createRoute({
  path: '/temperature-profiles',
  method: 'post',
  request: {
    body: jsonContentRequired(temperatureProfileSchemas.insert, 'The temperature profile to create'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(temperatureProfileSchemas.select, 'The created temperature profile'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(temperatureProfileSchemas.insert),
      'The validation error(s)',
    ),
  },
});

export const patch = createRoute({
  path: '/temperature-profiles/{id}',
  method: 'patch',
  request: {
    params: IdUuidParamsSchema,
    body: jsonContentRequired(temperatureProfileSchemas.patch, 'The temperature profile updates'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(temperatureProfileSchemas.select, 'The updated temperature profile'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Temperature profile not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(temperatureProfileSchemas.patch).or(createErrorSchema(IdParamsSchema)),
      'The validation error(s)',
    ),
  },
});

export const remove = createRoute({
  path: '/temperature-profiles/{id}',
  method: 'delete',
  request: {
    params: IdUuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Temperature profile deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Temperature profile not found'),
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
