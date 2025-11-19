import { createRoute } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';

import { jsonContent } from 'openapi/json-content';
import { createMessageObjectSchema } from 'schemas/responses/message.schema';

export const healthCheck = createRoute({
  tags: ['Health Check'],
  method: 'get',
  path: '/health-check',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(createMessageObjectSchema('Hello Hono!'), 'Health Check API'),
  },
});

export type HealthCheckRoute = typeof healthCheck;
