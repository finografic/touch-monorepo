import { createRoute, z } from '@hono/zod-openapi';
import { orderSchemas } from 'db/schemas/orders.schema';
import { notFoundSchema } from 'lib/constants';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';

// Schema for the readable view response (includes both IDs and names)
const orderReadableSchema = z.object({
  id: z.string(),
  // Foreign key IDs
  drinkTypeId: z.string(),
  drinkSubtypeId: z.string().optional(),
  volumeId: z.string(),
  containerTypeId: z.string(),
  temperatureProfileId: z.string(),
  // Human-readable names
  drinkTypeName: z.string(),
  drinkSubtypeName: z.string().optional(),
  volumeName: z.string(),
  containerTypeName: z.string(),
  temperatureProfileName: z.string(),
  // Other fields
  defaultTempConsume: z.number(),
  defaultTempFreeze: z.number(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const tags = ['DrinkOrders'];

export const list = createRoute({
  path: '/orders',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(orderReadableSchema),
      'List of available drink orders with both IDs and human-readable names',
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
