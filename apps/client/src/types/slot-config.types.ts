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

// Grid configuration constants
export const NUM_ROWS = 3; // Always 3 rows
export const NUM_SLOTS = 16; // Always 16 total slots
export const MIN_COLUMNS = 2;
export const MAX_COLUMNS = 5;

// Helper to calculate columns from active slots
export const calculateColumns = (activeSlotCount: number): number => {
  // activeSlotCount includes the special slot, so we subtract 1 for grid slots
  return Math.floor((activeSlotCount - 1) / NUM_ROWS);
};
