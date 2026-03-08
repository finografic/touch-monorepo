import * as v from 'valibot';
import { validator } from 'hono-openapi';

import { temperatureProfileSchemas } from 'db/schemas/temperature_profiles.schema';
import { createRouter } from 'lib/create-app';
import { IdUuidParamsSchema } from 'schemas/id-uuid-params.schema';
import * as handlers from './temperature-profile.handlers';
import * as routes from './temperature-profile.routes';

const querySchema = v.object({
  orderId: v.optional(v.string()),
});

const router = createRouter();

router.get('/temperature-profiles',
  routes.list,
  validator('query', querySchema),
  handlers.list,
);

router.get('/temperature-profiles/:id',
  routes.getOne,
  validator('param', IdUuidParamsSchema),
  handlers.getOne,
);

router.post('/temperature-profiles',
  routes.create,
  validator('json', temperatureProfileSchemas.insert),
  handlers.create,
);

router.patch('/temperature-profiles/:id',
  routes.patch,
  validator('param', IdUuidParamsSchema),
  validator('json', temperatureProfileSchemas.patch),
  handlers.patch,
);

router.delete('/temperature-profiles/:id',
  routes.remove,
  validator('param', IdUuidParamsSchema),
  handlers.remove,
);

export default router;
