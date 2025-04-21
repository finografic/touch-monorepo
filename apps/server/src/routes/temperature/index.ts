import { createRouter } from 'lib/create-app';
import * as handlers from './temperature.handlers';
import * as routes from './temperature.routes';

export default createRouter()
  .openapi(routes.getSettings, handlers.getSettings)
  .openapi(routes.calculate, handlers.calculate);
