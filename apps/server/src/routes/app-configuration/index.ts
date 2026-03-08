import { validator } from 'hono-openapi';

import { createRouter } from 'lib/create-app';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as handlers from './app-configuration.handlers';
import * as routes from './app-configuration.routes';
import { appConfigSchemas, nameParamSchema } from './app-configuration.routes';

const router = createRouter();

router.get('/app-configuration', routes.list, handlers.list);
router.get('/app-configuration/key/:name', routes.getByKey, validator('param', nameParamSchema), handlers.getByKey);
router.get('/app-configuration/:id', routes.getOne, validator('param', IdCuidParamsSchema), handlers.getOne);
router.patch('/app-configuration/:id', routes.patch, validator('param', IdCuidParamsSchema), validator('json', appConfigSchemas.patch), handlers.patch);

export default router;
