import { validator } from 'hono-openapi';
import { createRouter } from 'lib/create-app';
import { containerTypeSchemas } from 'db/schemas/container_types.schema';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as handlers from './container-type.handlers';
import * as routes from './container-type.routes';

const router = createRouter();
router.get('/container-types', routes.list, handlers.list);
router.get('/container-types/:id', routes.getOne, validator('param', IdCuidParamsSchema), handlers.getOne);
router.post('/container-types', routes.create, validator('json', containerTypeSchemas.insert), handlers.create);
router.patch('/container-types/:id', routes.patch, validator('param', IdCuidParamsSchema), validator('json', containerTypeSchemas.patch), handlers.patch);
router.delete('/container-types/:id', routes.remove, validator('param', IdCuidParamsSchema), handlers.remove);

export default router;
