import type { SlotType } from './slots.types';

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
export const NUM_RELAYS = 16; // Always 16 total slots
export const MIN_COLUMNS = 2;
export const MAX_COLUMNS = 4;

// Helper to calculate columns from active slots
export const calculateColumns = (activeSlotCount: number): number => {
  // activeSlotCount may include the special slot (slotNumber === NUM_RELAYS).
  // Calculate number of grid slots (exclude the special slot if present by convention)
  const gridSlots = Math.max(0, activeSlotCount - 1);

  // Use ceiling so N grid slots fill to the next full column (3 rows per column)
  let cols = Math.ceil(gridSlots / NUM_ROWS);

  // Clamp to allowed range
  cols = Math.max(MIN_COLUMNS, Math.min(MAX_COLUMNS, cols));
  return cols;
};
