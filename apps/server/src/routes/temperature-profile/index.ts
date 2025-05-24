import { createRouter } from 'lib/create-app';
import * as handlers from './temperature-profile.handlers';
import * as routes from './temperature-profile.routes';

export default createRouter()
  .openapi(routes.getSettings, handlers.getSettings)
  .openapi(routes.calculate, handlers.calculate);
