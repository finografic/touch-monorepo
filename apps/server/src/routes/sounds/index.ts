import { createRouter } from 'lib/create-app';
import * as handlers from './sounds.handlers';
import * as routes from './sounds.routes';

export default createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.upload, handlers.upload)
  .openapi(routes.remove, handlers.remove)
  .openapi(routes.getSettings, handlers.getSettings)
  .openapi(routes.updateSettings, handlers.updateSettings)
  .openapi(routes.serveFile, handlers.serveFile)
  .openapi(routes.listByType, handlers.listByType)
  .openapi(routes.uploadByType, handlers.uploadByType)
  .openapi(routes.removeByType, handlers.removeByType);
