import type { ReactNode } from 'react';

import type { TimerBasic, TimerItem } from 'providers/TimersProvider/timer.types';
import type { OrderFilters } from 'types/filters.types';

import type { CreateSettersType } from 'utils/zustand';
import type { SETTER_PREFIX, TimersKeys } from './TimerContext';

export interface RecallConfig {
  filters: OrderFilters;
  temperatures: Record<string, number>;
  durations: Record<string, number>;
  selectedOrders?: number[];
}

export interface RecallState {
  config: RecallConfig | null;
  expiresAt: number | null; // Timestamp when config expires
}

export interface TimersValues {
  [TimersKeys.timers]: TimerItem[];
  [TimersKeys.snooze]: boolean;
  [TimersKeys.maintenance]: TimerBasic[];
  [TimersKeys.recall]: RecallState;
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
  // Maintenance timers (basic timers)
  startMaintenanceTimer: (slotNumber: number, durationSeconds?: number) => void;
  stopMaintenanceTimer: (slotNumber: number) => void;
  resetMaintenanceTimer: (slotNumber: number, durationSeconds?: number) => void;
  getMaintenanceTimerBySlot: (slotNumber: number) => TimerBasic | undefined;
  // Recall config (configuration recall system)
  setRecallConfig: (config: RecallConfig, forceResetTimer?: boolean) => void;
  clearRecallConfig: () => void;
  getRecallConfig: () => RecallConfig | null;
  isRecallExpired: () => boolean;
  getRecallRemainingTime: () => number; // Returns remaining time in ms, or 0 if expired
};

export interface TimersProviderProps {
  initialValue?: TimersStore;
  children: ReactNode;
}

export interface TimersStore extends TimersValues {
  actions: TimersActions;
}
