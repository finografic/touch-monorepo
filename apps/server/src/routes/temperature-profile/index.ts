import { createRouter } from 'lib/create-app';
import * as handlers from './temperature-profile.handlers';
import * as routes from './temperature-profile.routes';

export default createRouter()
  // Static routes first
  .openapi(routes.getMinMax, handlers.getMinMax)
  .openapi(routes.list, handlers.list)
  // Dynamic routes after
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.create, handlers.create)
  .openapi(routes.patch, handlers.patch)
  .openapi(routes.remove, handlers.remove)
  .openapi(routes.getByTemperature, handlers.getByTemperature);
