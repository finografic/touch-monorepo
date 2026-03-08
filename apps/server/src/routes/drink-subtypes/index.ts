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

const router = createRouter();
router.get('/drink-types/:drinkTypeId/subtypes', routes.list, validator('param', DrinkTypeParamsSchema), handlers.list);
router.get('/drink-types/:drinkTypeId/subtypes/:id', routes.getOne, validator('param', DrinkTypeSubtypeParamsSchema), handlers.getOne);
router.post('/drink-types/:drinkTypeId/subtypes', routes.create, validator('param', DrinkTypeParamsSchema), validator('json', insertWithoutDrinkTypeId), handlers.create);
router.patch('/drink-types/:drinkTypeId/subtypes/:id', routes.patch, validator('param', DrinkTypeSubtypeParamsSchema), validator('json', drinkSubtypeSchemas.patch), handlers.patch);
router.delete('/drink-types/:drinkTypeId/subtypes/:id', routes.remove, validator('param', DrinkTypeSubtypeParamsSchema), handlers.remove);

export default router;
