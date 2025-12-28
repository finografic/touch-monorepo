import type { SlotConfiguration, SlotItem } from 'types/slot-config.types';
import { type SelectedSlotItem, SlotType } from 'types/slots.types';

export const NUM_ROWS_DEFAULT = 3; // Always 3 rows
export const NUM_RELAYS = 16; // Always 16 total slots
export const MIN_COLUMNS = 2;
export const MAX_COLUMNS = 4;

export const INITIAL_SLOT_ITEM: SelectedSlotItem = {
  id: '',
  slotType: SlotType.A,
  slotNumber: 0,
  isSelected: false,
  filters: {},
  session: undefined,
};

export const DEFAULT_SLOTS_CONFIG: SlotItem[] = [
  // export const DEFAULT_SLOTS_CONFIG: Partial<SlotConfiguration>[] = [
  { slotType: SlotType.A, slotNumber: 1, isActive: true },
  { slotType: SlotType.B, slotNumber: 2, isActive: true },
  { slotType: SlotType.B, slotNumber: 3, isActive: true },
  { slotType: SlotType.B, slotNumber: 4, isActive: true },
  { slotType: SlotType.B, slotNumber: 5, isActive: true },
  { slotType: SlotType.B, slotNumber: 6, isActive: true },
  { slotType: SlotType.B, slotNumber: 7, isActive: true },
  { slotType: SlotType.B, slotNumber: 8, isActive: true },
  { slotType: SlotType.B, slotNumber: 9, isActive: true },
  { slotType: SlotType.C, slotNumber: 10, isActive: false },
  { slotType: SlotType.B, slotNumber: 11, isActive: false },
  { slotType: SlotType.B, slotNumber: 12, isActive: false },
  { slotType: SlotType.C, slotNumber: 13, isActive: false },
  { slotType: SlotType.B, slotNumber: 14, isActive: false },
  { slotType: SlotType.B, slotNumber: 15, isActive: false },
  { slotType: SlotType.C, slotNumber: 16, isActive: false },
];
