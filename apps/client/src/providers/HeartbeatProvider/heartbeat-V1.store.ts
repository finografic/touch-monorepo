import { createStore } from 'zustand/vanilla';

import type { HeartbeatValues } from 'providers/HeartbeatProvider/HeartbeatContext.types';

export const heartbeatStore = createStore<HeartbeatValues>(() => ({
  tick: 0,
  now: Date.now(),
}));

// Start ticking externally (not in React)
setInterval(() => {
  heartbeatStore.setState({
    tick: heartbeatStore.getState().tick + 1,
    now: Date.now(),
  });
}, 1000);
