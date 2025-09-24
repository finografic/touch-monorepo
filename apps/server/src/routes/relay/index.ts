import { createRouter } from 'lib/create-app';
import * as handlers from './relay.handlers';
import * as routes from './relay.routes';

export default createRouter()
  .openapi(routes.toggleRelay, handlers.toggleRelay)
  .openapi(routes.getRelayStates, handlers.getRelayStates)
  .openapi(routes.getRelayState, handlers.getRelayState)
  .openapi(routes.getRelayStatus, handlers.getRelayStatus)
  .openapi(routes.turnAllRelaysOn, handlers.turnAllRelaysOn)
  .openapi(routes.turnAllRelaysOff, handlers.turnAllRelaysOff)
  .openapi(routes.reconnectRelay, handlers.reconnectRelay)
  .openapi(routes.disconnectRelay, handlers.disconnectRelay);
