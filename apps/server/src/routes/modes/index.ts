import { validator } from 'hono-openapi';
import { createRouter } from 'lib/create-app';
import { modeSchemas } from 'db/schemas/modes.schema';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as handlers from './modes.handlers';
import * as routes from './modes.routes';

const router = createRouter();
router.get('/modes', routes.list, handlers.list);
router.post('/modes', routes.create, validator('json', modeSchemas.insert), handlers.create);
router.patch('/modes/active-states', routes.updateActiveStates, validator('json', routes.activeStatesBodySchema), handlers.updateActiveStates);
router.patch('/modes/default-mode', routes.updateDefaultMode, validator('json', routes.defaultModeBodySchema), handlers.updateDefaultMode);
router.get('/modes/:id', routes.getOne, validator('param', IdCuidParamsSchema), handlers.getOne);
router.patch('/modes/:id', routes.patch, validator('param', IdCuidParamsSchema), validator('json', modeSchemas.patch), handlers.patch);
router.delete('/modes/:id', routes.remove, validator('param', IdCuidParamsSchema), handlers.remove);

export default router;
