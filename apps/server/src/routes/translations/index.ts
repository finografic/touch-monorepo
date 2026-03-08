import { validator } from 'hono-openapi';

import { translationUiSchemas } from 'db/schemas/translations_ui.schema';
import { createRouter } from 'lib/create-app';
import * as handlers from './translations.handlers';
import * as routes from './translations.routes';
import { namespaceAndIdParamSchema, namespaceParamSchema } from './translations.routes';

export default createRouter()
  .get(routes.list.path,    routes.list,   validator('param', namespaceParamSchema), handlers.list)
  .get(routes.getOne.path,    routes.getOne,   validator('param', namespaceAndIdParamSchema), handlers.getOne)
  .post(routes.create.path,    routes.create,   validator('param', namespaceParamSchema), validator('json', translationUiSchemas.insert), handlers.create)
  .patch(routes.patch.path,    routes.patch,   validator('param', namespaceAndIdParamSchema), validator('json', translationUiSchemas.patch), handlers.patch)
  .delete(routes.remove.path,    routes.remove,   validator('param', namespaceAndIdParamSchema), handlers.remove);
