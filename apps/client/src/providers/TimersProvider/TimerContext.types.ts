import type { ReactNode } from 'react';

import type { TimerBasic, TimerItem } from 'providers/TimersProvider/timer.types';

import type { CreateSettersType } from 'utils/zustand';

import type { SETTER_PREFIX, TimersKeys } from './TimerContext';

export interface TimersValues {
  [TimersKeys.timers]: TimerItem[];
  [TimersKeys.snooze]: boolean;
  [TimersKeys.maintenance]: TimerBasic;
}

type TimersSetters = CreateSettersType<TimersValues, typeof SETTER_PREFIX>;

type TimersActions = TimersSetters & {
  addTimer: (timer: Omit<TimerItem, 'id' | 'createdAt'>) => void;
  updateTimer: (id: string, updates: Partial<TimerItem>) => void;
  removeTimer: (id: string) => void;
  clearCompletedTimers: () => void;
  clearAllTimers: () => void;
  getTimersBySession: (sessionId: string) => TimerItem[];
  getRunningTimers: () => TimerItem[];
  getCompletedTimers: () => TimerItem[];
  getTimerByOrderId: (orderId: string) => TimerItem | undefined;
  getTimerBySlotNumber: (slotNumber: number) => TimerItem | undefined;
  getTimerMap: () => Map<number, TimerItem>;
  updateTimerByOrderId: (orderId: string, updates: Partial<TimerItem>) => void;
};

export interface TimersProviderProps {
  initialValue?: TimersStore;
  children: ReactNode;
}

export interface TimersStore extends TimersValues {
  actions: TimersActions;
}
