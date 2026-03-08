import { validator } from 'hono-openapi';

import { volumeSchemas } from 'db/schemas/volumes.schema';
import { createRouter } from 'lib/create-app';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as handlers from './drink-volume.handlers';
import * as routes from './drink-volume.routes';

const router = createRouter();

router.get('/drink-volumes',
  routes.list,
  handlers.list,
);

router.get('/drink-volumes/:id',
  routes.getOne,
  validator('param', IdCuidParamsSchema),
  handlers.getOne,
);

router.post('/drink-volumes',
  routes.create,
  validator('json', volumeSchemas.insert),
  handlers.create,
);

router.patch('/drink-volumes/:id',
  routes.patch,
  validator('param', IdCuidParamsSchema),
  validator('json', volumeSchemas.patch),
  handlers.patch,
);

router.delete('/drink-volumes/:id',
  routes.remove,
  validator('param', IdCuidParamsSchema),
  handlers.remove,
);

export default router;
