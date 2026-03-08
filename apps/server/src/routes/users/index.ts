import { validator } from 'hono-openapi';

import { userSchemas } from 'db/schemas/auth_user.schema';
import { createRouter } from 'lib/create-app';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as handlers from './users.handlers';
import * as routes from './users.routes';

const router = createRouter();

router.get('/users', routes.list, handlers.list);
router.get('/users/:id', routes.getOne, validator('param', IdCuidParamsSchema), handlers.getOne);
router.patch('/users/:id', routes.patch, validator('param', IdCuidParamsSchema), validator('json', userSchemas.patch), handlers.patch);
router.delete('/users/:id', routes.remove, validator('param', IdCuidParamsSchema), handlers.remove);

export default router;
