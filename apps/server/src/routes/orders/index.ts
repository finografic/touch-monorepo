import { validator } from 'hono-openapi';

import { orderSchemas } from 'db/schemas/orders.schema';
import { createRouter } from 'lib/create-app';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as handlers from './orders.handlers';
import * as routes from './orders.routes';
import { cleanupBodySchema } from './orders.routes';

export default createRouter()
  .get(routes.list.path,    routes.list,   handlers.list)
  .get(routes.listReadable.path,    routes.listReadable,   handlers.listReadable)
  .get(routes.getOne.path,    routes.getOne,   validator('param', IdCuidParamsSchema), handlers.getOne)
  .get(routes.getOneReadable.path,    routes.getOneReadable,   validator('param', IdCuidParamsSchema), handlers.getOneReadable)
  .post(routes.create.path,    routes.create,   validator('json', orderSchemas.insert), handlers.create)
  .patch(routes.patch.path,    routes.patch,   validator('param', IdCuidParamsSchema), validator('json', orderSchemas.patch), handlers.patch)
  .post(routes.cleanup.path,    routes.cleanup,   validator('json', cleanupBodySchema), handlers.cleanup)
  .delete(routes.remove.path,    routes.remove,   validator('param', IdCuidParamsSchema), handlers.remove)
  .get(routes.getTemperatureProfiles.path,    routes.getTemperatureProfiles,   validator('param', IdCuidParamsSchema), handlers.getTemperatureProfiles)
  .delete(routes.deleteTemperatureProfiles.path,    routes.deleteTemperatureProfiles,   validator('param', IdCuidParamsSchema), handlers.deleteTemperatureProfiles);
