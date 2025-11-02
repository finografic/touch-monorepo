import { createRoute, z } from '@hono/zod-openapi';
import { drinkSubtypeSchemas } from 'db/schemas/drink_subtypes.schema';
import { notFoundSchema } from 'lib/zod.errors';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema } from 'stoker/openapi/schemas';

const tags = ['DrinkSubtypes'];

// Parameter schema for nested routes
const DrinkTypeSubtypeParamsSchema = z.object({
  drinkTypeId: z.string().cuid(),
  id: z.string().cuid(),
});

const DrinkTypeParamsSchema = z.object({
  drinkTypeId: z.string().cuid(),
});

export const list = createRoute({
  path: '/drink-types/{drinkTypeId}/subtypes',
  method: 'get',
  request: {
    params: DrinkTypeParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(drinkSubtypeSchemas.select),
      'List of drink subtypes for the specified drink type',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Drink type not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(DrinkTypeParamsSchema),
      'Invalid drink type ID or drink type does not support subtypes',
    ),
  },
});

export const getOne = createRoute({
  path: '/drink-types/{drinkTypeId}/subtypes/{id}',
  method: 'get',
  request: {
    params: DrinkTypeSubtypeParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(drinkSubtypeSchemas.select, 'The requested drink subtype'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Drink subtype not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(DrinkTypeSubtypeParamsSchema),
      'Invalid parameters',
    ),
  },
});

export const create = createRoute({
  path: '/drink-types/{drinkTypeId}/subtypes',
  method: 'post',
  request: {
    params: DrinkTypeParamsSchema,
    body: jsonContentRequired(
      drinkSubtypeSchemas.insert.omit({ drinkTypeId: true }),
      'The drink subtype to create',
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(drinkSubtypeSchemas.select, 'The created drink subtype'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Drink type not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(drinkSubtypeSchemas.insert).or(createErrorSchema(DrinkTypeParamsSchema)),
      'The validation error(s)',
    ),
  },
});

export const patch = createRoute({
  path: '/drink-types/{drinkTypeId}/subtypes/{id}',
  method: 'patch',
  request: {
    params: DrinkTypeSubtypeParamsSchema,
    body: jsonContentRequired(drinkSubtypeSchemas.patch, 'The drink subtype updates'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(drinkSubtypeSchemas.select, 'The updated drink subtype'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Drink subtype not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(drinkSubtypeSchemas.patch).or(createErrorSchema(DrinkTypeSubtypeParamsSchema)),
      'The validation error(s)',
    ),
  },
});

export const remove = createRoute({
  path: '/drink-types/{drinkTypeId}/subtypes/{id}',
  method: 'delete',
  request: {
    params: DrinkTypeSubtypeParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Drink subtype deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Drink subtype not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(DrinkTypeSubtypeParamsSchema),
      'Invalid parameters',
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
