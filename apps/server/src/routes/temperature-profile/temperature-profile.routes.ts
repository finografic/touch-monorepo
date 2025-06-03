import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { temperatureProfileSchemas } from 'db/schemas/temperature_profiles.schema';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { notFoundSchema } from 'lib/constants';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';

const tags = ['TemperatureProfile'];

// Static routes first
export const getMinMax = createRoute({
  path: '/temperature-profiles/min-max',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        min: z.number(),
        max: z.number(),
      }),
      'Min and max temperatures from all profiles',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'No temperature profiles found'),
  },
});

export const list = createRoute({
  path: '/temperature-profiles',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(temperatureProfileSchemas.select),
      'List of available drink types',
    ),
  },
});

export const getOne = createRoute({
  path: '/temperature-profiles/{id}',
  method: 'get',
  request: {
    params: IdCuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(temperatureProfileSchemas.select, 'The requested drink type'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Drink type not found'),
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
    body: jsonContentRequired(temperatureProfileSchemas.insert, 'The drink type to create'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(temperatureProfileSchemas.select, 'The created drink type'),
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
    params: IdCuidParamsSchema,
    body: jsonContentRequired(temperatureProfileSchemas.patch, 'The drink type updates'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(temperatureProfileSchemas.select, 'The updated drink type'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Drink type not found'),
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
    params: IdCuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Drink type deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Drink type not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error',
    ),
  },
});

export const getByTemperature = createRoute({
  path: '/temperature-profiles/by-temperature/{temperature}',
  method: 'get',
  request: {
    params: z.object({
      temperature: z.coerce.number(),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      temperatureProfileSchemas.select,
      'Temperature profile matching the temperature',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'No matching temperature profile found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(z.object({ temperature: z.number() })),
      'Invalid temperature value',
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
export type GetMinMaxRoute = typeof getMinMax;
export type GetByTemperatureRoute = typeof getByTemperature;
