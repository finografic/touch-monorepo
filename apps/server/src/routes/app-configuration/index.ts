import { createRouter } from 'lib/create-app';
import * as handlers from './app-configuration.handlers';
import * as routes from './app-configuration.routes';

export default createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.getByKey, handlers.getByKey)
  .openapi(routes.patch, handlers.patch);
