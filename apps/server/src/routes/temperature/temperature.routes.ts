import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContentRequired } from 'stoker/openapi/helpers';

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

export const calculate = createRoute({
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

export type CalculateRoute = typeof calculate;
