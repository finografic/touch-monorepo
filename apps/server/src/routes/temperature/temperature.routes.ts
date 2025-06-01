import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema } from 'stoker/openapi/schemas';
import { notFoundSchema } from 'lib/constants';
import { temperatureProfileSchemas } from 'db/schemas/temperature_profiles.schema';

const tags = ['Temperature'];

// Custom schema for temperature profile IDs which follow the format temp_+X.Y
const TempProfileIdParamsSchema = z.object({
  id: z
    .string()
    .regex(/^temp_\+\d+(\.\d+)?$/, 'Invalid temperature profile ID format - must match pattern temp_+X.Y'),
});

export const list = createRoute({
  path: '/temperature-profiles',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(
        temperatureProfileSchemas.select.pick({
          id: true,
          temperature: true,
          timeA: true,
          timeB: true,
          timeC: true,
        }),
      ),
      'List of available temperature profiles',
    ),
  },
});

export const getOne = createRoute({
  path: '/temperature-profiles/{id}',
  method: 'get',
  request: {
    params: TempProfileIdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(temperatureProfileSchemas.select, 'The requested temperature profile'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Temperature profile not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(TempProfileIdParamsSchema),
      'Invalid id format',
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
    params: TempProfileIdParamsSchema,
    body: jsonContentRequired(temperatureProfileSchemas.patch, 'The temperature profile updates'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(temperatureProfileSchemas.select, 'The updated temperature profile'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Temperature profile not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(temperatureProfileSchemas.patch).or(createErrorSchema(TempProfileIdParamsSchema)),
      'The validation error(s)',
    ),
  },
});

export const remove = createRoute({
  path: '/temperature-profiles/{id}',
  method: 'delete',
  request: {
    params: TempProfileIdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Temperature profile deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Temperature profile not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(TempProfileIdParamsSchema),
      'Invalid id format',
    ),
  },
});

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

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
export type GetMinMaxRoute = typeof getMinMax;
