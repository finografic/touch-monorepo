import { createRoute, z } from '@hono/zod-openapi';
import { drinkTypeSchemas } from 'db/schemas/drink_types.schema';
import { notFoundSchema } from 'lib/constants';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema } from 'stoker/openapi/schemas';

const tags = ['DrinkTypes'];

export const list = createRoute({
  path: '/drink-types',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(drinkTypeSchemas.select), 'The list of drink types'),
  },
});

export const getOne = createRoute({
  path: '/drink-types/{id}',
  method: 'get',
  request: {
    params: IdCuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(drinkTypeSchemas.select, 'The requested drink type'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Drink type not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdCuidParamsSchema), 'Invalid id'),
  },
});

export const create = createRoute({
  path: '/drink-types',
  method: 'post',
  request: {
    body: jsonContentRequired(drinkTypeSchemas.insert, 'The drink type to create'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(drinkTypeSchemas.select, 'The created drink type'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(drinkTypeSchemas.insert),
      'The validation error(s)',
    ),
  },
});

export const patch = createRoute({
  path: '/drink-types/{id}',
  method: 'patch',
  request: {
    params: IdCuidParamsSchema,
    body: jsonContentRequired(drinkTypeSchemas.patch, 'The drink type updates'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(drinkTypeSchemas.select, 'The updated drink type'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Drink type not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(drinkTypeSchemas.patch).or(createErrorSchema(IdCuidParamsSchema)),
      'The validation error(s)',
    ),
  },
});

export const remove = createRoute({
  path: '/drink-types/{id}',
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
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdCuidParamsSchema), 'Invalid id'),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
