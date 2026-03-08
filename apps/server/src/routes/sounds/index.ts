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

export default createRouter()
  // Static paths first to avoid conflicts with dynamic /:type param
  .get(routes.list.path,    routes.list,   handlers.list)
  .get(routes.getSettings.path,    routes.getSettings,   handlers.getSettings)
  .put(routes.updateSettings.path,    routes.updateSettings,   validator('json', soundSettingsSchema), handlers.updateSettings)
  .get(routes.serveFile.path,    routes.serveFile,   validator('param', filenameParamSchema), handlers.serveFile)
  .post(routes.upload.path,    routes.upload,   handlers.upload)
  .get(routes.listByType.path,    routes.listByType,   validator('param', typeParamSchema), handlers.listByType)
  .post(routes.uploadByType.path,    routes.uploadByType,   validator('param', typeParamSchema), handlers.uploadByType)
  .delete(routes.remove.path,    routes.remove,   validator('param', idParamSchema), handlers.remove)
  .delete(routes.removeByType.path,    routes.removeByType,   validator('param', typeAndIdParamSchema), handlers.removeByType);
