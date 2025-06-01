import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema } from 'stoker/openapi/schemas';
import { notFoundSchema } from 'lib/constants';

const tags = ['Temperature'];

// Schema for temperature settings response
const temperatureSettingsSchema = z.object({
  defaultTempConsume: z.number(),
  minTempConsume: z.number(),
  maxTempConsume: z.number(),
  defaultTempFreeze: z.number().optional(),
});

// Schema for temperature calculation request
const temperatureCalculationSchema = z.object({
  drinkTypeId: z.string(),
  drinkSubtypeId: z.string().optional(),
  containerTypeId: z.string(),
  volumeId: z.string(),
  initialTemp: z.number(),
  targetTemp: z.number(),
});

// Schema for temperature calculation response
const temperatureResultSchema = z.object({
  estimatedDurationSeconds: z.number(),
  phases: z.array(
    z.object({
      durationSeconds: z.number(),
      startTemp: z.number(),
      endTemp: z.number(),
      description: z.string(),
    }),
  ),
  timeTableId: z.string(),
  recommendations: z.array(z.string()),
});

// Schema for error response
const errorResponseSchema = z.object({
  message: z.string(),
});

// Route for getting temperature settings
export const getSettings = createRoute({
  path: '/temperature/settings',
  method: 'get',
  tags,
  request: {
    query: z.object({
      drinkTypeId: z.string(),
      drinkSubtypeId: z.string().optional(),
      containerTypeId: z.string(),
      volumeId: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      temperatureSettingsSchema,
      'Temperature settings for the given configuration',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorResponseSchema, 'Resource not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(
        z.object({
          drinkTypeId: z.string(),
          containerTypeId: z.string(),
          volumeId: z.string(),
        }),
      ),
      'Invalid parameters provided',
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(errorResponseSchema, 'Internal server error'),
  },
});

// Route for calculating temperature change duration
export const calculate = createRoute({
  path: '/temperature/calculate',
  method: 'post',
  tags,
  request: {
    body: jsonContentRequired(temperatureCalculationSchema, 'Temperature calculation parameters'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(temperatureResultSchema, 'Temperature calculation result'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorResponseSchema, 'Resource not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(temperatureCalculationSchema),
      'Invalid parameters provided',
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(errorResponseSchema, 'Internal server error'),
  },
});

export type GetSettingsRoute = typeof getSettings;
export type CalculateRoute = typeof calculate;
