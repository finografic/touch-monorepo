import { validator } from 'hono-openapi';
import { createRouter } from 'lib/create-app';
import { containerTypeSchemas } from 'db/schemas/container_types.schema';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as handlers from './container-type.handlers';
import * as routes from './container-type.routes';

export default createRouter()
  .get(routes.list.path,    routes.list,   handlers.list)
  .get(routes.getOne.path,    routes.getOne,   validator('param', IdCuidParamsSchema), handlers.getOne)
  .post(routes.create.path,    routes.create,   validator('json', containerTypeSchemas.insert), handlers.create)
  .patch(routes.patch.path,    routes.patch,   validator('param', IdCuidParamsSchema), validator('json', containerTypeSchemas.patch), handlers.patch)
  .delete(routes.remove.path,    routes.remove,   validator('param', IdCuidParamsSchema), handlers.remove);
