import * as v from 'valibot';
import * as HttpStatusCodes from 'stoker/http-status-codes';

import { createRouter } from 'lib/create-app';
import { json, route } from 'lib/openapi.helpers';

const router = createRouter();

const indexRoute = route('/', {
  tags: ['Index'],
  description: 'Hono + Drizzle API Index',
  responses: {
    [HttpStatusCodes.OK]: json(
      v.object({ message: v.string() }),
      'Hono + Drizzle API Index',
    ),
  },
});

router.get(
  indexRoute.path,
  indexRoute,
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
