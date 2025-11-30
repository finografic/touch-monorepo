import type { ReactNode } from 'react';
import type { RecallConfig, RecallState, TimerBasic, TimerItem } from 'providers/TimersProvider/timer.types';
import type { CreateSettersType } from 'utils/zustand';
import type { SETTER_PREFIX, TimersKeys } from './TimersContext';

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
  updateTimers: (updatedTimers: TimerItem[]) => void;
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
};

export interface TimersProviderProps {
  initialValue?: TimersStore;
  children: ReactNode;
}

export interface TimersStore extends TimersValues {
  actions: TimersActions;
}
