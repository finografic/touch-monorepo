import { StatusCodes as HttpStatusCodes } from 'http-status-codes';
import * as v from 'valibot';

import { orderSchemas } from 'db/schemas/orders.schema';
import { temperatureProfileSchemas } from 'db/schemas/temperature_profiles.schema';
import { json, route } from 'lib/openapi.helpers';
import { notFoundSchema, validationErrorSchema } from 'lib/valibot.errors';

const tags = ['DrinkOrders'];

// Schema for orders_readable view
const ordersReadableSchema = v.object({
  id:                 v.string(),
  mode:               v.number(),
  drinkType:          v.string(),
  drinkSubtype:       v.nullable(v.string()),
  volume:             v.string(),
  containerType:      v.string(),
  defaultTempConsume: v.number(),
  defaultTempFreeze:  v.number(),
  isActive:           v.boolean(),
  createdAt:          v.nullable(v.string()),
  updatedAt:          v.nullable(v.string()),
});

// Schema for temperature profile in readable response
const temperatureProfileSchema = v.object({
  id:          v.string(),
  orderId:     v.string(),
  modeId:      v.string(),
  temperature: v.number(),
  timeA:       v.number(),
  timeB:       v.number(),
  timeC:       v.number(),
});

// Schema for response with temperature profiles
const ordersReadableResponseSchema = v.object({
  ...ordersReadableSchema.entries,
  temperatureProfiles: v.array(temperatureProfileSchema),
});

// Schema for cleanup request body
export const cleanupBodySchema = v.object({
  drinkTypeIds:     v.optional(v.array(v.string())),
  drinkSubtypeIds:  v.optional(v.array(v.string())),
  volumeIds:        v.optional(v.array(v.string())),
  containerTypeIds: v.optional(v.array(v.string())),
});

export const list = route('/orders', {
  tags,
  description: 'List of available drink orders',
  responses: {
    [HttpStatusCodes.OK]: json(
      v.array(orderSchemas.select),
      'List of available drink orders',
    ),
  },
});

export const listReadable = route('/orders-readable', {
  tags,
  description: 'List of orders with readable names from view',
  responses: {
    [HttpStatusCodes.OK]: json(
      v.array(ordersReadableSchema),
      'List of orders with readable names from view',
    ),
  },
});

export const getOne = route('/orders/:id', {
  tags,
  description: 'Get a single drink order by ID',
  responses: {
    [HttpStatusCodes.OK]:                   json(orderSchemas.select, 'The requested drink order'),
    [HttpStatusCodes.NOT_FOUND]:            json(notFoundSchema, 'Drink order not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid id error'),
  },
});

export const getOneReadable = route('/orders-readable/:id', {
  tags,
  description: 'Get a single order with readable names and temperature profiles',
  responses: {
    [HttpStatusCodes.OK]:                   json(ordersReadableResponseSchema, 'The requested order with readable names and temperature profiles'),
    [HttpStatusCodes.NOT_FOUND]:            json(notFoundSchema, 'Order not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid id error'),
  },
});

export const create = route('/orders', {
  tags,
  description: 'Create a new drink order',
  responses: {
    [HttpStatusCodes.OK]:                   json(orderSchemas.select, 'The created drink order'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const patch = route('/orders/:id', {
  tags,
  description: 'Update a drink order',
  responses: {
    [HttpStatusCodes.OK]:                   json(orderSchemas.select, 'The updated drink order'),
    [HttpStatusCodes.NOT_FOUND]:            json(notFoundSchema, 'Drink order not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const remove = route('/orders/:id', {
  tags,
  description: 'Delete a drink order',
  responses: {
    [HttpStatusCodes.NO_CONTENT]:           { description: 'Drink order deleted' },
    [HttpStatusCodes.NOT_FOUND]:            json(notFoundSchema, 'Drink order not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid id error'),
  },
});

export const cleanup = route('/orders/cleanup', {
  tags,
  description: 'Bulk delete orders by related type IDs',
  responses: {
    [HttpStatusCodes.OK]:          json(v.object({ deleted: v.number() }), 'Number of orders deleted'),
    [HttpStatusCodes.BAD_REQUEST]: json(v.object({ message: v.string() }), 'No identifiers provided'),
  },
});

export const getTemperatureProfiles = route('/orders/:id/temperature-profiles', {
  tags: ['Orders'],
  description: 'Get temperature profiles for an order',
  responses: {
    [HttpStatusCodes.OK]:        json(v.array(temperatureProfileSchemas.select), 'Temperature profiles for the order'),
    [HttpStatusCodes.NOT_FOUND]: json(notFoundSchema, 'Order not found'),
  },
});

export const deleteTemperatureProfiles = route('/orders/:id/temperature-profiles', {
  tags: ['Orders'],
  description: 'Delete all temperature profiles for an order',
  responses: {
    [HttpStatusCodes.NO_CONTENT]: { description: 'All temperature profiles for the order deleted' },
    [HttpStatusCodes.NOT_FOUND]:  json(notFoundSchema, 'Order not found'),
  },
});
