import type { SlotStatus } from 'pages/MainPage/MainPage.types';

import type { FlowTypeValue } from 'types/flow.types';

export interface TimerBasic {
  id: string;
  slotNumber: number;
  duration: number;
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
