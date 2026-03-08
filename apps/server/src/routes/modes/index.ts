import { validator } from 'hono-openapi';

import { modeSchemas } from 'db/schemas/modes.schema';
import { createRouter } from 'lib/create-app';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as handlers from './modes.handlers';
import * as routes from './modes.routes';

export default createRouter()
  .get(routes.list.path,    routes.list,   handlers.list)
  .post(routes.create.path,    routes.create,   validator('json', modeSchemas.insert), handlers.create)
  .patch(routes.updateActiveStates.path,    routes.updateActiveStates,   validator('json', routes.activeStatesBodySchema), handlers.updateActiveStates)
  .patch(routes.updateDefaultMode.path,    routes.updateDefaultMode,   validator('json', routes.defaultModeBodySchema), handlers.updateDefaultMode)
  .get(routes.getOne.path,    routes.getOne,   validator('param', IdCuidParamsSchema), handlers.getOne)
  .patch(routes.patch.path,    routes.patch,   validator('param', IdCuidParamsSchema), validator('json', modeSchemas.patch), handlers.patch)
  .delete(routes.remove.path,    routes.remove,   validator('param', IdCuidParamsSchema), handlers.remove);
