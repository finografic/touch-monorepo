import * as v from 'valibot';
import { validator } from 'hono-openapi';

import { createRouter } from 'lib/create-app';
import * as handlers from './sounds.handlers';
import * as routes from './sounds.routes';

const soundSettingsSchema = v.object({
  alarm:  v.nullable(v.string()),
  finish: v.nullable(v.string()),
});

const typeParamSchema = v.object({
  type: v.picklist(['alarm', 'finish']),
});

const idParamSchema = v.object({
  id: v.string(),
});

const typeAndIdParamSchema = v.object({
  type: v.picklist(['alarm', 'finish']),
  id:   v.string(),
});

const filenameParamSchema = v.object({
  filename: v.string(),
});

const router = createRouter();

// Static paths first to avoid conflicts with dynamic /:type param
router.get('/sounds',
  routes.list,
  handlers.list,
);

router.get('/sounds/settings',
  routes.getSettings,
  handlers.getSettings,
);

router.put('/sounds/settings',
  routes.updateSettings,
  validator('json', soundSettingsSchema),
  handlers.updateSettings,
);

router.get('/sounds/files/:filename',
  routes.serveFile,
  validator('param', filenameParamSchema),
  handlers.serveFile,
);

router.post('/sounds/upload',
  routes.upload,
  handlers.upload,
);

router.get('/sounds/:type',
  routes.listByType,
  validator('param', typeParamSchema),
  handlers.listByType,
);

router.post('/sounds/:type/upload',
  routes.uploadByType,
  validator('param', typeParamSchema),
  handlers.uploadByType,
);

router.delete('/sounds/:id',
  routes.remove,
  validator('param', idParamSchema),
  handlers.remove,
);

router.delete('/sounds/:type/:id',
  routes.removeByType,
  validator('param', typeAndIdParamSchema),
  handlers.removeByType,
);

export default router;
