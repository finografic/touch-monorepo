import { createRouter } from 'lib/create-app';
import * as handlers from './translations-ui.handlers';
import * as routes from './translations-ui.routes';

export default createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.create, handlers.create)
  .openapi(routes.patch, handlers.patch)
  .openapi(routes.remove, handlers.remove);
