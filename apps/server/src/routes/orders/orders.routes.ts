import { createRoute, z } from '@hono/zod-openapi';
import { orderSchemas } from 'db/schemas/orders.schema';
import { notFoundSchema } from 'lib/constants';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';

const tags = ['DrinkOrders'];

export const list = createRoute({
  path: '/orders',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(
        orderSchemas.select.pick({
          id: true,
          drinkTypeName: true,
          drinkSubtypeName: true,
          containerTypeName: true,
          volumeName: true,
          defaultTempConsume: true,
          defaultTempFreeze: true,
          temperatureProfileId: true,
        }),
      ),
      'List of available drink orders',
    ),
  },
});

export const getOne = createRoute({
  path: '/orders/{id}',
  method: 'get',
  request: {
    params: IdCuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(orderSchemas.select, 'The requested drink order'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Drink order not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error',
    ),
  },
});

export const create = createRoute({
  path: '/orders',
  method: 'post',
  request: {
    body: jsonContentRequired(orderSchemas.insert, 'The drink order to create'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(orderSchemas.select, 'The created drink order'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(orderSchemas.insert),
      'The validation error(s)',
    ),
  },
});

export const patch = createRoute({
  path: '/orders/{id}',
  method: 'patch',
  request: {
    params: IdCuidParamsSchema,
    body: jsonContentRequired(orderSchemas.patch, 'The drink order updates'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(orderSchemas.select, 'The updated drink order'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Drink order not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(orderSchemas.patch).or(createErrorSchema(IdParamsSchema)),
      'The validation error(s)',
    ),
  },
});

export const remove = createRoute({
  path: '/orders/{id}',
  method: 'delete',
  request: {
    params: IdCuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Drink order deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Drink order not found'),
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
