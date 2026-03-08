import { validator } from 'hono-openapi';
import { createRouter } from 'lib/create-app';
import { drinkTypeSchemas } from 'db/schemas/drink_types.schema';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as handlers from './drink-type.handlers';
import * as routes from './drink-type.routes';

const router = createRouter();
router.get('/drink-types', routes.list, handlers.list);
router.get('/drink-types/:id', routes.getOne, validator('param', IdCuidParamsSchema), handlers.getOne);
router.post('/drink-types', routes.create, validator('json', drinkTypeSchemas.insert), handlers.create);
router.patch('/drink-types/:id', routes.patch, validator('param', IdCuidParamsSchema), validator('json', drinkTypeSchemas.patch), handlers.patch);
router.delete('/drink-types/:id', routes.remove, validator('param', IdCuidParamsSchema), handlers.remove);

export default router;
