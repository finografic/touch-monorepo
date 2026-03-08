import { validator } from 'hono-openapi';

import { createRouter } from 'lib/create-app';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as handlers from './app-configuration.handlers';
import * as routes from './app-configuration.routes';
import { appConfigSchemas, nameParamSchema } from './app-configuration.routes';

export default createRouter()
  .get(routes.list.path,    routes.list,   handlers.list)
  .get(routes.getByKey.path,    routes.getByKey,   validator('param', nameParamSchema), handlers.getByKey)
  .get(routes.getOne.path,    routes.getOne,   validator('param', IdCuidParamsSchema), handlers.getOne)
  .patch(routes.patch.path,    routes.patch,   validator('param', IdCuidParamsSchema), validator('json', appConfigSchemas.patch), handlers.patch);
