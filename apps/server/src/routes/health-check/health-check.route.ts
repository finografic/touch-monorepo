import { createRoute } from '@hono/zod-openapi';
import { jsonContent } from 'openapi/json-content';
import { createMessageObjectSchema } from 'schemas/responses/message.schema';
import * as HttpStatusCodes from 'stoker/http-status-codes';

export const healthCheck = createRoute({
  tags: ['Health Check'],
  method: 'get',
  path: '/health-check',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(createMessageObjectSchema('Hello Hono!'), 'Health Check API'),
  },
});

export type HealthCheckRoute = typeof healthCheck;
