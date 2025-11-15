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
