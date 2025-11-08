import { subscribeWithSelector } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import type { HeartbeatValues } from 'providers/HeartbeatProvider/HeartbeatContext.types';

export const heartbeatStore = createStore<HeartbeatValues>()(
  subscribeWithSelector(() => ({
    tick: 0,
    now: Date.now(),
  })),
);

setInterval(() => {
  heartbeatStore.setState((s) => ({
    tick: s.tick + 1,
    now: Date.now(),
  }));
}, 1000);
