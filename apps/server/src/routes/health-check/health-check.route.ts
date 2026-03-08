import { StatusCodes as HttpStatusCodes } from 'http-status-codes';
import * as v from 'valibot';

import { json, route } from 'lib/openapi.helpers';

const messageSchema = v.object({
  success: v.boolean(),
  message: v.string(),
});

export const healthCheck = route('/health-check', {
  tags: ['Health Check'],
  description: 'Health Check API',
  responses: {
    [HttpStatusCodes.OK]: json(messageSchema, 'Health Check API'),
  },
});
