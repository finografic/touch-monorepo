import { createRouter } from 'lib/create-app';
import * as handlers from './orders.handlers';
import * as routes from './orders.routes';

export default createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.listReadable, handlers.listReadable)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.getOneReadable, handlers.getOneReadable)
  .openapi(routes.create, handlers.create)
  .openapi(routes.patch, handlers.patch)
  .openapi(routes.remove, handlers.remove);
