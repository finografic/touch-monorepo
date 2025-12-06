import { createStore, type StoreApi, useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { createSetters, createZustandContext } from '@finografic/zustand-context-creator';
import type { HeartbeatStore, HeartbeatValues } from './HeartbeatContext.types';

let heartbeatInterval: ReturnType<typeof setInterval> | null = null;

export const DISPLAY_NAME = 'Heartbeat';
export const SETTER_PREFIX = '';

export enum HeartbeatKeys {
  tick = 'tick',
  now = 'now',
}

export const defaultValue: HeartbeatValues = {
  tick: 0,
  now: Date.now(),
};

export const HeartbeatContext = createZustandContext(({ initialValue }) => {
  return createStore<HeartbeatStore>()(
    subscribeWithSelector(
      (set, get): HeartbeatStore => ({
        ...defaultValue,
        ...initialValue,
        actions: {
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),
          start: () => {
            if (heartbeatInterval) return; // prevent duplicates
            heartbeatInterval = setInterval(() => {
              const tick = get().tick + 1;
              set({ tick, now: Date.now() });
            }, 1000);
            console.log('✅ Heartbeat started');
          },
          stop: () => {
            if (heartbeatInterval) {
              clearInterval(heartbeatInterval);
              heartbeatInterval = null;
              console.log('🛑 Heartbeat stopped');
            }
          },
        },
      }),
    ),
  );
});

type HeartbeatReturn = Omit<HeartbeatStore, 'actions'> & HeartbeatStore['actions'];

export const useHeartbeat = (): HeartbeatReturn => {
  const store = HeartbeatContext.useContext();
  if (!store) {
    throw new Error(`use${SETTER_PREFIX} must be used within a ${DISPLAY_NAME}Provider`);
  }

  // const [now, setNow] = useState(heartbeatStore.getState().now)

  // useEffect(() => {
  //   const unsubscribe = heartbeatStore.subscribe((state) => setNow(state.now))
  //   return unsubscribe
  // }, [])

  // const seconds = Math.floor((now - start) / 1000)

  return useStore<StoreApi<HeartbeatStore>, HeartbeatReturn>(
    store,
    useShallow(({ actions, ...state }) => ({
      ...state,
      ...actions,
    })),
  );
};
