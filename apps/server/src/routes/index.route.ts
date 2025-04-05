import { createRoute } from '@hono/zod-openapi';
import { createRouter } from 'lib/create-app';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';

import { createMessageObjectSchema } from 'stoker/openapi/schemas';

const router = createRouter().openapi(
  createRoute({
    tags: ['Index'],
    method: 'get',
    path: '/',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        createMessageObjectSchema('Hono + Drizzle API'),
        'Hono + Drizzle API Index',
      ),
    },
  }),
  (c) => {
    return c.json(
      {
        message: 'Hono + Drizzle API',
      },
      HttpStatusCodes.OK,
    );
  },
);

export default router;
