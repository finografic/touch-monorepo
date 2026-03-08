import { validator } from 'hono-openapi';
import { createRouter } from 'lib/create-app';
import { drinkTypeSchemas } from 'db/schemas/drink_types.schema';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as handlers from './drink-type.handlers';
import * as routes from './drink-type.routes';

export default createRouter()
  .get(routes.list.path,    routes.list,   handlers.list)
  .get(routes.getOne.path,    routes.getOne,   validator('param', IdCuidParamsSchema), handlers.getOne)
  .post(routes.create.path,    routes.create,   validator('json', drinkTypeSchemas.insert), handlers.create)
  .patch(routes.patch.path,    routes.patch,   validator('param', IdCuidParamsSchema), validator('json', drinkTypeSchemas.patch), handlers.patch)
  .delete(routes.remove.path,    routes.remove,   validator('param', IdCuidParamsSchema), handlers.remove);
