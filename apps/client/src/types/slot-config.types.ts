import type { SlotType } from './orders.types';

export interface SlotConfiguration {
  id: string;
  slotNumber: number;
  slotType: SlotType;
  isActive: boolean;
  relayNumber: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSlotConfigRequest {
  slotNumber: number;
  slotType: SlotType;
  isActive: boolean;
  relayNumber: number | null;
}

export interface UpdateSlotConfigRequest {
  slotType?: SlotType;
  isActive?: boolean;
  relayNumber?: number | null;
}

export interface BulkUpdateSlotConfigRequest {
  configurations: Array<{
    slotNumber: number;
    slotType: SlotType;
    isActive: boolean;
    relayNumber: number | null;
  }>;
}

export interface SlotConfigResponse {
  success: boolean;
  data: SlotConfiguration;
  count?: number;
}

export interface SlotConfigsResponse {
  success: boolean;
  data: SlotConfiguration[];
  count: number;
}

export interface SlotConfigErrorResponse {
  success: false;
  error: string;
}

// Grid configuration types
export interface GridConfig {
  columns: number; // 2-5 columns
  rows: number; // Always 3 rows
  totalSlots: number; // columns * rows + 1 (special pad)
}

export const GRID_CONFIGS: Record<number, GridConfig> = {
  2: { columns: 2, rows: 3, totalSlots: 7 }, // 0-5 + special pad 6
  3: { columns: 3, rows: 3, totalSlots: 10 }, // 0-8 + special pad 9
  4: { columns: 4, rows: 3, totalSlots: 13 }, // 0-11 + special pad 12
  5: { columns: 5, rows: 3, totalSlots: 16 }, // 0-14 + special pad 15
};
