import { createStore, type StoreApi, useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { createSetters, createZustandContext } from 'utils/zustand';

import type { TimerItem, TimersStore, TimersValues } from './TimerContext.types';

export const DISPLAY_NAME = 'Timers';
export const SETTER_PREFIX = '';

export enum TimersKeys {
  timers = 'timers',
}

export const defaultValue: TimersValues = {
  timers: [],
};

export const TimersContext = createZustandContext(({ initialValue }) => {
  return createStore<TimersStore>()(
    subscribeWithSelector(
      (set, get): TimersStore => ({
        ...defaultValue,
        ...initialValue,
        actions: {
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),
          addTimer: (timerData: Omit<TimerItem, 'id' | 'createdAt'>) => {
            const { timers } = get();

            // Check if there's already a timer for this slot
            const existingTimer = timers.find((t) => t.slotNumber === timerData.slotNumber);

            const newTimer: TimerItem = {
              ...timerData,
              id:
                typeof crypto !== 'undefined' && crypto.randomUUID
                  ? crypto.randomUUID()
                  : `timer-${Date.now()}-${Math.random()}`,
              createdAt: new Date().toISOString(),
            };

            if (existingTimer) {
              // Replace existing timer
              const updatedTimers = timers.map((timer) =>
                timer.slotNumber === timerData.slotNumber ? newTimer : timer,
              );

              set({ timers: updatedTimers });
            } else {
              // Add new timer
              set({ timers: [...timers, newTimer] });
            }
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
          getTimerByOrderId: (orderId: string) => {
            const { timers } = get();
            return timers.find((timer) => timer.orderId === orderId);
          },
          getTimerBySlotNumber: (slotNumber: number) => {
            const { timers } = get();
            return timers.find((timer) => timer.slotNumber === slotNumber);
          },
          getTimerMap: () => {
            const { timers } = get();
            return new Map(timers.map((timer) => [timer.slotNumber, timer]));
          },
          updateTimerByOrderId: (orderId: string, updates: Partial<TimerItem>) => {
            const { timers } = get();
            const updatedTimers = timers.map((timer) => {
              if (timer.orderId === orderId) {
                return { ...timer, ...updates };
              }
              return timer;
            });
            set({ timers: updatedTimers });
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

  return useStore<StoreApi<TimersStore>, TimersReturn>(
    store,
    useShallow(({ actions, ...state }) => ({
      ...state,
      ...actions,
    })),
  );
};

export const useTimersOptional = (): TimersReturn | null => {
  try {
    return useTimers();
  } catch (error) {
    return null;
  }
};
