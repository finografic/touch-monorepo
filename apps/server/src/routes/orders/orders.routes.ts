import { createRoute, z } from '@hono/zod-openapi';
import type { OrdersReadableView } from 'db/schemas/orders_readable_view.schema';
import { orderSchemas } from 'db/schemas/orders.schema';
import { temperatureProfileSchemas } from 'db/schemas/temperature_profiles.schema';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import { IdUuidParamsSchema } from 'schemas/id-uuid-params.schema';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';
import { notFoundSchema } from 'lib/zod.errors';

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
          modeId: true,
          drinkTypeId: true,
          drinkSubtypeId: true,
          volumeId: true,
          containerTypeId: true,
          defaultTempConsume: true,
          defaultTempFreeze: true,
        }),
      ),
      'List of available drink orders',
    ),
  },
});

// Create Zod schema for orders_readable view
const ordersReadableSchema = z.object({
  id: z.string(),
  mode: z.number(),
  drinkType: z.string(),
  drinkSubtype: z.string().nullable(),
  volume: z.string(),
  containerType: z.string(),
  defaultTempConsume: z.number(),
  defaultTempFreeze: z.number(),
  isActive: z.boolean(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

// Create schema for temperature profiles
const temperatureProfileSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  modeId: z.string(),
  temperature: z.number(),
  timeA: z.number(),
  timeB: z.number(),
  timeC: z.number(),
});

// Create schema for response with temperature profiles
const ordersReadableResponseSchema = ordersReadableSchema.extend({
  temperatureProfiles: z.array(temperatureProfileSchema),
});

export const listReadable = createRoute({
  path: '/orders-readable',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(ordersReadableSchema),
      'List of orders with readable names from view',
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

export const getOneReadable = createRoute({
  path: '/orders-readable/{id}',
  method: 'get',
  request: {
    params: IdCuidParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      ordersReadableResponseSchema,
      'The requested order with readable names and temperature profiles',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Order not found'),
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

// Bulk cleanup endpoint to delete orders by related type ids
export const cleanup = createRoute({
  path: '/orders/cleanup',
  method: 'post',
  tags,
  request: {
    body: jsonContentRequired(
      z.object({
        drinkTypeIds: z.array(z.string()).optional(),
        drinkSubtypeIds: z.array(z.string()).optional(),
        volumeIds: z.array(z.string()).optional(),
        containerTypeIds: z.array(z.string()).optional(),
      }),
      'Identifiers of related entities whose orders should be deleted',
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        deleted: z.number(),
      }),
      'Number of orders deleted',
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      z.object({
        message: z.string(),
      }),
      'No identifiers provided',
    ),
  },
});

export const getTemperatureProfiles = createRoute({
  method: 'get',
  path: '/orders/:id/temperature-profiles',
  tags: ['Orders'],
  request: {
    params: IdCuidParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(temperatureProfileSchemas.select),
        },
      },
      description: 'Temperature profiles for the order',
    },
    404: {
      content: {
        'application/json': {
          schema: notFoundSchema,
        },
      },
      description: 'Order not found',
    },
  },
});

export const deleteTemperatureProfiles = createRoute({
  method: 'delete',
  path: '/orders/:id/temperature-profiles',
  tags: ['Orders'],
  request: {
    params: IdCuidParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'All temperature profiles for the order deleted',
    },
    404: {
      content: {
        'application/json': {
          schema: notFoundSchema,
        },
      },
      description: 'Order not found',
    },
  },
});

export type ListRoute = typeof list;
export type ListReadableRoute = typeof listReadable;
export type GetOneRoute = typeof getOne;
export type GetOneReadableRoute = typeof getOneReadable;
export type CreateRoute = typeof create;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
export type CleanupRoute = typeof cleanup;

export type GetTemperatureProfilesRoute = typeof getTemperatureProfiles;
export type DeleteTemperatureProfilesRoute = typeof deleteTemperatureProfiles;
