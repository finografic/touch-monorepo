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

const router = createRouter();

router.get('/supported-languages',
  routes.list,
  handlers.list,
);

// More specific route registered before /:id to avoid param capture conflicts
router.get('/supported-languages/:isoCode/translation-status',
  routes.getTranslationStatus,
  validator('param', isoCodeParamsSchema),
  handlers.getTranslationStatusHandler,
);

router.get('/supported-languages/:id',
  routes.getOne,
  validator('param', IdCuidParamsSchema),
  handlers.getOne,
);

router.post('/supported-languages',
  routes.create,
  validator('json', supportedLanguageSchemas.insert),
  handlers.create,
);

router.patch('/supported-languages/:id',
  routes.patch,
  validator('param', IdCuidParamsSchema),
  validator('json', supportedLanguageSchemas.patch),
  handlers.patch,
);

router.delete('/supported-languages/:id',
  routes.remove,
  validator('param', IdCuidParamsSchema),
  handlers.remove,
);

export default router;
