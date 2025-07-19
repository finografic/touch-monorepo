import type { ReactNode } from 'react';
import type { SETTER_PREFIX, TimersKeys } from './TimerContext';
import type { FlowTypeValue } from 'types/flow.types';

export type TimerStatus = 'idle' | 'processing' | 'completed';

export interface TimerItem {
  id: string;
  sessionId: string;
  slotNumber: number; // Position 0-9
  orderId: string; // Persistent CUID that gets remembered
  flowType: FlowTypeValue;
  duration: number;
  remaining: number;
  status: TimerStatus;
  estimatedCompletionTime?: string;
  createdAt: string;
  completedAt?: string;
}

export interface TimersValues {
  [TimersKeys.timers]: TimerItem[];
}

type TimersSetters = {
  [K in keyof TimersValues as TimersValues[K] extends boolean
    ? `set${Capitalize<string & K>}`
    : `set${typeof SETTER_PREFIX}${Capitalize<string & K>}`]: (val: TimersValues[K]) => void;
};

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
  updateTimerByOrderId: (orderId: string, updates: Partial<TimerItem>) => void;
};

export interface TimersProviderProps {
  initialValue?: TimersStore;
  children: ReactNode;
}

export interface TimersStore extends TimersValues {
  actions: TimersActions;
}
