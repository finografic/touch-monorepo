import { getSlotsConfig, type SlotItemConfig } from 'utils/slot-config.utils';
import { type SlotItem, SlotType } from 'types/slots.types';

export type { SlotItemConfig } from 'utils/slot-config.utils';

export const SLOT_ITEMS_CONFIG: SlotItemConfig[] = getSlotsConfig();

export const INITIAL_SLOT_ITEM: SlotItem = {
  id: '',
  slotType: SlotType.A,
  slotNumber: 0,
  isSelected: false,
  filters: {},
  session: undefined,
};

export const DEFAULT_SLOTS_CONFIG: SlotItemConfig[] = [
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
