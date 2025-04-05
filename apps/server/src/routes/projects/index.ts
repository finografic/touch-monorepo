import { createRouter } from 'lib/create-app';
import * as handlers from './projects.handlers';
import * as routes from './projects.routes';

export default createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.patch, handlers.patch)
  .openapi(routes.remove, handlers.remove);
