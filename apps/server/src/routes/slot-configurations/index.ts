import { validator } from 'hono-openapi';

import { createRouter } from 'lib/create-app';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as handlers from './slot-configurations.handlers';
import * as routes from './slot-configurations.routes';
import { bulkUpdateBodySchema, slotConfigSchemas } from './slot-configurations.routes';

const router = createRouter();

router.get('/slot-configurations', routes.list, handlers.list);
router.get('/slot-configurations/:id', routes.getOne, validator('param', IdCuidParamsSchema), handlers.getOne);
router.post('/slot-configurations', routes.create, validator('json', slotConfigSchemas.insert), handlers.create);
router.patch('/slot-configurations/:id', routes.patch, validator('param', IdCuidParamsSchema), validator('json', slotConfigSchemas.patch), handlers.patch);
router.delete('/slot-configurations/:id', routes.remove, validator('param', IdCuidParamsSchema), handlers.remove);
router.post('/slot-configurations/bulk-update', routes.bulkUpdate, validator('json', bulkUpdateBodySchema), handlers.bulkUpdate);
router.post('/slot-configurations/reset', routes.reset, handlers.reset);

export default router;
