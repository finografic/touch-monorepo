// import type { ItemType } from './orders.types';

export enum ItemType {
  A = 'A',
  B = 'B',
  C = 'C',
}

export interface SlotConfiguration {
  id: string;
  slotNumber: number;
  itemType: ItemType;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSlotConfigRequest {
  slotNumber: number;
  itemType: ItemType;
}

export interface UpdateSlotConfigRequest {
  itemType?: ItemType;
}

export interface BulkUpdateSlotConfigRequest {
  configurations: Array<{
    slotNumber: number;
    itemType: ItemType;
  }>;
}
