import * as v from 'valibot';
import { validator } from 'hono-openapi';

import { supportedLanguageSchemas } from 'db/schemas/supported_languages.schema';
import { createRouter } from 'lib/create-app';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as handlers from './supported-language.handlers';
import * as routes from './supported-language.routes';

const isoCodeParamsSchema = v.object({
  isoCode: v.string(),
});

export default createRouter()
  .get(routes.list.path,    routes.list,   handlers.list)
  // More specific route registered before /:id to avoid param capture conflicts
  .get(routes.getTranslationStatus.path,    routes.getTranslationStatus,   validator('param', isoCodeParamsSchema), handlers.getTranslationStatusHandler)
  .get(routes.getOne.path,    routes.getOne,   validator('param', IdCuidParamsSchema), handlers.getOne)
  .post(routes.create.path,    routes.create,   validator('json', supportedLanguageSchemas.insert), handlers.create)
  .patch(routes.patch.path,    routes.patch,   validator('param', IdCuidParamsSchema), validator('json', supportedLanguageSchemas.patch), handlers.patch)
  .delete(routes.remove.path,    routes.remove,   validator('param', IdCuidParamsSchema), handlers.remove);
