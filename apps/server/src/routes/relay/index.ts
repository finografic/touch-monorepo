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

const router = createRouter();

router.post('/relay/toggle/:slotNumber/:state',
  routes.toggleRelay,
  validator('param', toggleParamSchema),
  handlers.toggleRelay,
);

router.get('/relay/states',
  routes.getRelayStates,
  handlers.getRelayStates,
);

router.get('/relay/state/:slotNumber',
  routes.getRelayState,
  validator('param', slotNumberParamSchema),
  handlers.getRelayState,
);

router.get('/relay/status',
  routes.getRelayStatus,
  handlers.getRelayStatus,
);

router.post('/relay/all-on',
  routes.turnAllRelaysOn,
  handlers.turnAllRelaysOn,
);

router.post('/relay/all-off',
  routes.turnAllRelaysOff,
  handlers.turnAllRelaysOff,
);

router.post('/relay/reconnect',
  routes.reconnectRelay,
  handlers.reconnectRelay,
);

router.post('/relay/disconnect',
  routes.disconnectRelay,
  handlers.disconnectRelay,
);

router.post('/relay/init',
  routes.initializeRelay,
  handlers.initializeRelay,
);

export default router;
