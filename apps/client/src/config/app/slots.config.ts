import { type SelectedSlotItem, SlotType } from 'types/slots.types';
import type { SlotItem } from 'types/slot-config.types';

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
  { slotType: SlotType.A, slotNumber: 1 },
  { slotType: SlotType.B, slotNumber: 2 },
  { slotType: SlotType.B, slotNumber: 3 },
  { slotType: SlotType.B, slotNumber: 4 },
  { slotType: SlotType.B, slotNumber: 5 },
  { slotType: SlotType.B, slotNumber: 6 },
  { slotType: SlotType.B, slotNumber: 7 },
  { slotType: SlotType.B, slotNumber: 8 },
  { slotType: SlotType.B, slotNumber: 9 },
  { slotType: SlotType.C, slotNumber: 10 },
  { slotType: SlotType.B, slotNumber: 11 },
  { slotType: SlotType.B, slotNumber: 12 },
  { slotType: SlotType.C, slotNumber: 13 },
];
