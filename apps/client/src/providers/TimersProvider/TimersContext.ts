import { createSetters, createZustandContext } from '@finografic/zustand-context-creator';

import { createStore, type StoreApi, useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import type { SlotStatus } from 'pages/MainPage/MainPage.types';

import type { TimerBasic, TimerItem } from 'providers/TimersProvider/timer.types';

import { CONFIG_EXPIRY_TIME_MS } from 'config/app';
import type { RecallConfig } from './timer.types';
import type { TimersStore, TimersValues } from './TimersContext.types';

export const DISPLAY_NAME = 'Timers';
export const SETTER_PREFIX = '';

export enum TimersKeys {
  timers = 'timers',
  snooze = 'snooze',
  defrost = 'defrost',
  recall = 'recall',
}

export const defaultValue: TimersValues = {
  timers: [],
  snooze: false,
  defrost: null,
  recall: {
    config: null,
    expiresAt: null,
  },
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
              const updatedTimers = timers.map((timer) =>
                timer.slotNumber === timerData.slotNumber ? newTimer : timer,
              );
              set({ timers: updatedTimers });
            } else {
              // new timer..
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
          // NOTE: REMOVE ? useMainPageOperations - handleCancelSelected
          removeTimer: (id: string) => {
            const { timers } = get();
            const filteredTimers = timers.filter((timer) => timer.id !== id);
            set({ timers: filteredTimers });
          },
          // NOTE: REMOVE ? useMainPageOperations - handleResetCompleted
          updateTimers: (updatedTimers: TimerItem[]) => {
            set({ timers: updatedTimers });
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
          // ----- Maintenance timers (basic) -----
          startDefrostTimer: (slotNumber: number, durationSeconds: number = 600) => {
            const now = Date.now();
            const completionTime = new Date(now + durationSeconds * 1000).toISOString();
            const id =
              typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `maint-${now}`;
            const timer: TimerBasic = {
              id,
              slotNumber,
              duration: durationSeconds,
              status: 'processing' as SlotStatus,
              completionTime,
              createdAt: new Date(now).toISOString(),
            };

            set({ defrost: timer });
          },
          stopDefrostTimer: (slotNumber: number) => {
            const { defrost } = get();
            set({
              defrost: {
                ...defrost,
                slotNumber,
                status: 'idle' as SlotStatus,
                completionTime: undefined,
              } as TimerBasic,
            });
          },

          // ----- Recall config (configuration recall system) -----

          setRecallConfig: (config: RecallConfig, forceResetTimer = false) => {
            const { recall } = get();
            const now = Date.now();

            const isExpired = recall.expiresAt === null || now >= recall.expiresAt;

            // Set new config and reset timer if forced or expired
            if (forceResetTimer || isExpired) {
              set({ recall: { config, expiresAt: now + CONFIG_EXPIRY_TIME_MS } });
            } else {
              // Just update config, keep existing expiresAt
              set({ recall: { config, expiresAt: recall.expiresAt } });
            }
          },
          clearRecallConfig: () => {
            set({ recall: { config: null, expiresAt: null } });
          },
          getRecallConfig: (): RecallConfig | null => {
            const { recall } = get();
            const now = Date.now();

            if (recall.expiresAt === null || now >= recall.expiresAt) {
              set({ recall: { config: null, expiresAt: null } });
              return null;
            }

            return recall.config;
          },
        },
      }),
    ),
  );
});

type TimersReturn = Omit<TimersStore, 'actions'> & TimersStore['actions'];

export const useTimers = (
  { slotNumber }: { slotNumber: number } = { slotNumber: undefined },
): TimersReturn & { timer: TimerItem | undefined } => {
  const store = TimersContext.useContext();
  if (!store) {
    throw new Error(`use${DISPLAY_NAME} must be used within a ${DISPLAY_NAME}Provider`);
  }

  // convenience - return timer if slot number is passed
  const timer = store.getState().timers.find((t) => t.slotNumber === slotNumber);

  const storeReturn = useStore<StoreApi<TimersStore>, TimersReturn>(
    store,
    useShallow(({ actions, ...state }) => ({
      ...state,
      ...actions,
    })),
  );

  return { ...storeReturn, timer };
};
