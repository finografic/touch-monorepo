// import type { SlotType } from './orders.types';

export enum SlotType {
  A = 'A',
  B = 'B',
  C = 'C',
}

export interface SlotConfiguration {
  id: string;
  slotNumber: number;
  slotType: SlotType;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSlotConfigRequest {
  slotNumber: number;
  slotType: SlotType;
}

export interface UpdateSlotConfigRequest {
  slotType?: SlotType;
}

export interface BulkUpdateSlotConfigRequest {
  configurations: Array<{
    slotNumber: number;
    slotType: SlotType;
  }>;
}
