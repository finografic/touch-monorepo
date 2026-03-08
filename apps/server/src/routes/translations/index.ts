import { validator } from 'hono-openapi';

import { translationUiSchemas } from 'db/schemas/translations_ui.schema';
import { createRouter } from 'lib/create-app';
import * as handlers from './translations.handlers';
import * as routes from './translations.routes';
import { namespaceAndIdParamSchema, namespaceParamSchema } from './translations.routes';

const router = createRouter();

router.get('/translations/:namespace', routes.list, validator('param', namespaceParamSchema), handlers.list);
router.get('/translations/:namespace/:id', routes.getOne, validator('param', namespaceAndIdParamSchema), handlers.getOne);
router.post('/translations/:namespace', routes.create, validator('param', namespaceParamSchema), validator('json', translationUiSchemas.insert), handlers.create);
router.patch('/translations/:namespace/:id', routes.patch, validator('param', namespaceAndIdParamSchema), validator('json', translationUiSchemas.patch), handlers.patch);
router.delete('/translations/:namespace/:id', routes.remove, validator('param', namespaceAndIdParamSchema), handlers.remove);

export default router;
