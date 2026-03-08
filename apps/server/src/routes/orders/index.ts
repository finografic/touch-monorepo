import { validator } from 'hono-openapi';

import { orderSchemas } from 'db/schemas/orders.schema';
import { createRouter } from 'lib/create-app';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as handlers from './orders.handlers';
import * as routes from './orders.routes';
import { cleanupBodySchema } from './orders.routes';

const router = createRouter();

router.get('/orders', routes.list, handlers.list);
router.get('/orders-readable', routes.listReadable, handlers.listReadable);
router.get('/orders/:id', routes.getOne, validator('param', IdCuidParamsSchema), handlers.getOne);
router.get('/orders-readable/:id', routes.getOneReadable, validator('param', IdCuidParamsSchema), handlers.getOneReadable);
router.post('/orders', routes.create, validator('json', orderSchemas.insert), handlers.create);
router.patch('/orders/:id', routes.patch, validator('param', IdCuidParamsSchema), validator('json', orderSchemas.patch), handlers.patch);
router.post('/orders/cleanup', routes.cleanup, validator('json', cleanupBodySchema), handlers.cleanup);
router.delete('/orders/:id', routes.remove, validator('param', IdCuidParamsSchema), handlers.remove);
router.get('/orders/:id/temperature-profiles', routes.getTemperatureProfiles, validator('param', IdCuidParamsSchema), handlers.getTemperatureProfiles);
router.delete('/orders/:id/temperature-profiles', routes.deleteTemperatureProfiles, validator('param', IdCuidParamsSchema), handlers.deleteTemperatureProfiles);

export default router;
