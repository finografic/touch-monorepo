import * as v from 'valibot';
import { validator } from 'hono-openapi';

import { createRouter } from 'lib/create-app';
import * as handlers from './relay.handlers';
import * as routes from './relay.routes';

const slotNumberParamSchema = v.object({
  slotNumber: v.pipe(
    v.string(),
    v.transform((val) => Number.parseInt(val)),
  ),
});

const toggleParamSchema = v.object({
  slotNumber: v.pipe(
    v.string(),
    v.transform((val) => Number.parseInt(val)),
  ),
  state: v.pipe(
    v.string(),
    v.transform((val) => val === 'true'),
  ),
});

export default createRouter()
  .post(routes.toggleRelay.path,    routes.toggleRelay,   validator('param', toggleParamSchema), handlers.toggleRelay)
  .get(routes.getRelayStates.path,    routes.getRelayStates,   handlers.getRelayStates)
  .get(routes.getRelayState.path,    routes.getRelayState,   validator('param', slotNumberParamSchema), handlers.getRelayState)
  .get(routes.getRelayStatus.path,    routes.getRelayStatus,   handlers.getRelayStatus)
  .post(routes.turnAllRelaysOn.path,    routes.turnAllRelaysOn,   handlers.turnAllRelaysOn)
  .post(routes.turnAllRelaysOff.path,    routes.turnAllRelaysOff,   handlers.turnAllRelaysOff)
  .post(routes.reconnectRelay.path,    routes.reconnectRelay,   handlers.reconnectRelay)
  .post(routes.disconnectRelay.path,    routes.disconnectRelay,   handlers.disconnectRelay)
  .post(routes.initializeRelay.path,    routes.initializeRelay,   handlers.initializeRelay);
