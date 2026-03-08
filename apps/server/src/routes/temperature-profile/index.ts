import * as v from 'valibot';
import { validator } from 'hono-openapi';

import { temperatureProfileSchemas } from 'db/schemas/temperature_profiles.schema';
import { createRouter } from 'lib/create-app';
import { IdUuidParamsSchema } from 'schemas/id-uuid-params.schema';
import * as handlers from './temperature-profile.handlers';
import * as routes from './temperature-profile.routes';

const querySchema = v.object({
  orderId: v.optional(v.string()),
});

export default createRouter()
  .get(routes.list.path,    routes.list,   validator('query', querySchema), handlers.list)
  .get(routes.getOne.path,    routes.getOne,   validator('param', IdUuidParamsSchema), handlers.getOne)
  .post(routes.create.path,    routes.create,   validator('json', temperatureProfileSchemas.insert), handlers.create)
  .patch(routes.patch.path,    routes.patch,   validator('param', IdUuidParamsSchema), validator('json', temperatureProfileSchemas.patch), handlers.patch)
  .delete(routes.remove.path,    routes.remove,   validator('param', IdUuidParamsSchema), handlers.remove);
