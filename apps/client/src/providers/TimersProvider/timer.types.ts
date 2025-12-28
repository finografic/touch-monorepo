import type { SlotStatus } from 'pages/MainPage/MainPage.types';

import type { OrderFilters } from 'types/filters.types';
import type { FlowTypeValue } from 'types/flow.types';

export interface TimerBasic {
  id: string;
  slotNumber: number;
  duration: number;
  remaining?: number;
  status: SlotStatus;
  completionTime?: string;
  createdAt: string;
}

export interface TimerItem extends TimerBasic {
  sessionId: string;
  slotNumber: number; // Position 0-9
  orderId: string; // Persistent CUID that gets remembered
  flowType: FlowTypeValue;
}

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
