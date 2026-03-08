import * as v from 'valibot';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { describeRoute } from 'hono-openapi';

import { createRouter } from 'lib/create-app';
import { json } from 'lib/openapi.helpers';

const router = createRouter();

router.get(
  '/',
  describeRoute({
    tags: ['Index'],
    description: 'Hono + Drizzle API Index',
    responses: {
      [HttpStatusCodes.OK]: json(
        v.object({ message: v.string() }),
        'Hono + Drizzle API Index',
      ),
    },
  }),
  (context) => {
    return context.json(
      {
        message: 'Hono + Drizzle API',
      },
      HttpStatusCodes.OK,
    );
  },
);

export default router;
