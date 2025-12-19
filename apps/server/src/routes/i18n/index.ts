import { createRouter } from 'lib/create-app';
import * as handlers from './i18n.handlers';
import * as routes from './i18n.routes';

export default createRouter()
  .openapi(routes.getNamespace, handlers.getNamespace)
  .openapi(routes.getDomain, handlers.getDomain);
