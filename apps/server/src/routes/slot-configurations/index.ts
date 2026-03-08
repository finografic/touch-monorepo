import { validator } from 'hono-openapi';

import { createRouter } from 'lib/create-app';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as handlers from './slot-configurations.handlers';
import * as routes from './slot-configurations.routes';
import { bulkUpdateBodySchema, slotConfigSchemas } from './slot-configurations.routes';

export default createRouter()
  .get(routes.list.path,    routes.list,   handlers.list)
  .get(routes.getOne.path,    routes.getOne,   validator('param', IdCuidParamsSchema), handlers.getOne)
  .post(routes.create.path,    routes.create,   validator('json', slotConfigSchemas.insert), handlers.create)
  .patch(routes.patch.path,    routes.patch,   validator('param', IdCuidParamsSchema), validator('json', slotConfigSchemas.patch), handlers.patch)
  .delete(routes.remove.path,    routes.remove,   validator('param', IdCuidParamsSchema), handlers.remove)
  .post(routes.bulkUpdate.path,    routes.bulkUpdate,   validator('json', bulkUpdateBodySchema), handlers.bulkUpdate)
  .post(routes.reset.path,    routes.reset,   handlers.reset);
