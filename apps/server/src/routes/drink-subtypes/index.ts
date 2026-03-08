import { validator } from 'hono-openapi';
import * as v from 'valibot';
import { createRouter } from 'lib/create-app';
import { drinkSubtypeSchemas } from 'db/schemas/drink_subtypes.schema';
import { isCuid } from 'utils/cuid-validation';
import * as handlers from './drink-subtypes.handlers';
import * as routes from './drink-subtypes.routes';

const DrinkTypeParamsSchema = v.object({
  drinkTypeId: v.pipe(v.string(), v.check((val) => isCuid(val), 'Invalid drinkTypeId format - must be a valid CUID')),
});

const DrinkTypeSubtypeParamsSchema = v.object({
  drinkTypeId: v.pipe(v.string(), v.check((val) => isCuid(val), 'Invalid drinkTypeId format - must be a valid CUID')),
  id: v.pipe(v.string(), v.check((val) => isCuid(val), 'Invalid ID format - must be a valid CUID')),
});

const insertWithoutDrinkTypeId = v.omit(drinkSubtypeSchemas.insert, ['drinkTypeId']);

export default createRouter()
  .get(routes.list.path,    routes.list,   validator('param', DrinkTypeParamsSchema), handlers.list)
  .get(routes.getOne.path,    routes.getOne,   validator('param', DrinkTypeSubtypeParamsSchema), handlers.getOne)
  .post(routes.create.path,    routes.create,   validator('param', DrinkTypeParamsSchema), validator('json', insertWithoutDrinkTypeId), handlers.create)
  .patch(routes.patch.path,    routes.patch,   validator('param', DrinkTypeSubtypeParamsSchema), validator('json', drinkSubtypeSchemas.patch), handlers.patch)
  .delete(routes.remove.path,    routes.remove,   validator('param', DrinkTypeSubtypeParamsSchema), handlers.remove);
