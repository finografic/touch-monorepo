import { createRouter } from 'lib/create-app';
import * as handlers from './ui-labels.handlers';
import * as routes from './ui-labels.routes';

export default createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.save, handlers.save);
