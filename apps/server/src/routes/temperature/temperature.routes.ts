import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContentRequired } from 'stoker/openapi/helpers';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { calculateTemperatureSchema } from './temperature.schemas';
import { calculate } from './temperature.handlers';

const tags = ['Temperature'];

// Input schema for temperature calculation
const temperatureCalculationSchema = z.object({
  drinkTypeId: z.string(),
  drinkSubtypeId: z.string().optional(),
  containerTypeId: z.string(),
  volumeId: z.string(),
  initialTemp: z.number(),
  targetTemp: z.number(),
});

// Response schema for temperature calculation
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

// Schema for temperature settings response
const temperatureSettingsSchema = z.object({
  defaultConsumptionTemp: z.number(),
  minConsumptionTemp: z.number(),
  maxConsumptionTemp: z.number(),
  defaultFreezeTemp: z.number().optional(),
});

const router = new Hono();

router.post('/calculate', zValidator('json', calculateTemperatureSchema), calculate);

export const calculateRoute = createRoute({
  path: '/temperature/calculate',
  method: 'post',
  tags,
  request: {
    body: jsonContentRequired(temperatureCalculationSchema, 'Temperature calculation parameters'),
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        'application/json': {
          schema: temperatureResultSchema,
        },
      },
      description: 'Temperature calculation result',
    },
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: {
      description: 'Invalid parameters provided',
    },
  },
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
    [HttpStatusCodes.OK]: {
      content: {
        'application/json': {
          schema: temperatureSettingsSchema,
        },
      },
      description: 'Temperature settings for the given configuration',
    },
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: {
      description: 'Invalid parameters provided',
    },
  },
});

export type CalculateRoute = typeof calculateRoute;

export default router;
