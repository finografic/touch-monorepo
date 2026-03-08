import { validator } from 'hono-openapi';

import { volumeSchemas } from 'db/schemas/volumes.schema';
import { createRouter } from 'lib/create-app';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as handlers from './drink-volume.handlers';
import * as routes from './drink-volume.routes';

export default createRouter()
  .get(routes.list.path,    routes.list,   handlers.list)
  .get(routes.getOne.path,    routes.getOne,   validator('param', IdCuidParamsSchema), handlers.getOne)
  .post(routes.create.path,    routes.create,   validator('json', volumeSchemas.insert), handlers.create)
  .patch(routes.patch.path,    routes.patch,   validator('param', IdCuidParamsSchema), validator('json', volumeSchemas.patch), handlers.patch)
  .delete(routes.remove.path,    routes.remove,   validator('param', IdCuidParamsSchema), handlers.remove);
