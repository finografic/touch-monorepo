import type { SlotSpecial, SlotType } from './slots.types';

export interface SlotItem {
  slotType: SlotType | SlotSpecial;
  slotNumber: number;
  isActive?: boolean;
}

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
