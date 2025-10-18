import type { SlotStatus } from 'pages/MainPage/MainPage.types';
import type { ReactNode } from 'react';

import type { FlowTypeValue } from 'types/flow.types';
import type { CreateSettersType } from 'utils/zustand';
import type { SETTER_PREFIX, TimersKeys } from './TimerContext';

export interface TimerItem {
  id: string;
  sessionId: string;
  slotNumber: number; // Position 0-9
  orderId: string; // Persistent CUID that gets remembered
  flowType: FlowTypeValue;
  duration: number;
  remaining: number;
  status: SlotStatus;
  estimatedCompletionTime?: string;
  createdAt: string;
  completedAt?: string;
}

export interface TimersValues {
  [TimersKeys.timers]: TimerItem[];
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
