import { describeRoute } from 'hono-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as v from 'valibot';

import { json } from 'lib/openapi.helpers';

const messageSchema = v.object({
  success: v.boolean(),
  message: v.string(),
});

export const healthCheck = describeRoute({
  tags: ['Health Check'],
  description: 'Health Check API',
  responses: {
    [HttpStatusCodes.OK]: json(messageSchema, 'Health Check API'),
  },
});
