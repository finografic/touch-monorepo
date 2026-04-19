import * as v from 'valibot';
import { validator } from 'hono-openapi';

import { createRouter } from 'lib/create-app';
import * as handlers from './images.handlers';
import * as routes from './images.routes';

const imageSettingsSchema = v.object({
  product: v.nullable(v.string()),
  label: v.nullable(v.string()),
});

const typeParamSchema = v.object({
  type: v.picklist(['product', 'label']),
});

const idParamSchema = v.object({
  id: v.string(),
});

const typeAndIdParamSchema = v.object({
  type: v.picklist(['product', 'label']),
  id: v.string(),
});

const filenameParamSchema = v.object({
  filename: v.string(),
});

export default createRouter()
  .get(routes.list.path, routes.list, handlers.list)
  .get(routes.getSettings.path, routes.getSettings, handlers.getSettings)
  .put(
    routes.updateSettings.path,
    routes.updateSettings,
    validator('json', imageSettingsSchema),
    handlers.updateSettings,
  )
  .get(routes.serveFile.path, routes.serveFile, validator('param', filenameParamSchema), handlers.serveFile)
  .get(routes.listByType.path, routes.listByType, validator('param', typeParamSchema), handlers.listByType)
  .post(
    routes.uploadByType.path,
    routes.uploadByType,
    validator('param', typeParamSchema),
    handlers.uploadByType,
  )
  .delete(routes.remove.path, routes.remove, validator('param', idParamSchema), handlers.remove)
  .delete(
    routes.removeByType.path,
    routes.removeByType,
    validator('param', typeAndIdParamSchema),
    handlers.removeByType,
  );
