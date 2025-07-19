import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { TimerItem, TimersStore, TimersValues } from './TimerContext.types';
import { subscribeWithSelector } from 'zustand/middleware';

export const DISPLAY_NAME = 'Timers';
export const SETTER_PREFIX = '';

export enum TimersKeys {
  timers = 'timers',
}

export const defaultValue: TimersValues = {
  timers: [],
};

export const TimersContext = createZustandContext(({ initialValue }) => {
  log('__DEV: TimersContext', 'cyan', initialValue);
  return createStore<TimersStore>()(
    subscribeWithSelector(
      (set, get): TimersStore => ({
        ...defaultValue,
        ...initialValue,
        actions: {
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),
          addTimer: (timerData: Omit<TimerItem, 'id' | 'createdAt'>) => {
            const { timers } = get();
            const newTimer: TimerItem = {
              ...timerData,
              id:
                typeof crypto !== 'undefined' && crypto.randomUUID
                  ? crypto.randomUUID()
                  : `timer-${Date.now()}-${Math.random()}`,
              createdAt: new Date().toISOString(),
            };
            set({ timers: [...timers, newTimer] });
          },
          updateTimer: (id: string, updates: Partial<TimerItem>) => {
            const { timers } = get();
            const updatedTimers = timers.map((timer) => {
              if (timer.id === id) {
                return { ...timer, ...updates };
              }
              return timer;
            });
            set({ timers: updatedTimers });
          },
          removeTimer: (id: string) => {
            const { timers } = get();
            const filteredTimers = timers.filter((timer) => timer.id !== id);
            set({ timers: filteredTimers });
          },
          clearCompletedTimers: () => {
            const { timers } = get();
            const activeTimers = timers.filter((timer) => timer.status !== 'completed');
            set({ timers: activeTimers });
          },
          clearAllTimers: () => {
            set({ timers: [] });
          },
          getTimersBySession: (sessionId: string) => {
            const { timers } = get();
            return timers.filter((timer) => timer.sessionId === sessionId);
          },
          getRunningTimers: () => {
            const { timers } = get();
            return timers.filter((timer) => timer.status === 'processing');
          },
          getCompletedTimers: () => {
            const { timers } = get();
            return timers.filter((timer) => timer.status === 'completed');
          },
        },
      }),
    ),
  );
});

type TimersReturn = Omit<TimersStore, 'actions'> & TimersStore['actions'];

export const useTimers = (): TimersReturn => {
  const store = TimersContext.useContext();
  if (!store) {
    throw new Error(`use${DISPLAY_NAME} must be used within a ${DISPLAY_NAME}Provider`);
  }

  store.subscribe((_state: any, _prev: any) => {
    // store change
  });

  return useStore<StoreApi<TimersStore>, TimersReturn>(store, ({ actions, ...state }) => ({
    ...state,
    ...actions,
  }));
};

export const useTimersOptional = (): TimersReturn | null => {
  try {
    return useTimers();
  } catch (error) {
    return null;
  }
};
