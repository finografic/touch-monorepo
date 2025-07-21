import { createRouter } from 'lib/create-app';
import * as handlers from './slot-configurations.handlers';
import * as routes from './slot-configurations.routes';

export default createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.create, handlers.create)
  .openapi(routes.patch, handlers.patch)
  .openapi(routes.remove, handlers.remove)
  .openapi(routes.bulkUpdate, handlers.bulkUpdate)
  .openapi(routes.reset, handlers.reset);
