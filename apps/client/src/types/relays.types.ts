import { SlotSpecial, SlotType } from 'types/slots.types';
import type { ColorName } from 'styles';

export interface RelayConfig {
  id: string;
  slotNumber: number;
  slotType: SlotType;
  relayNumber: number | null;
  isActive: boolean;
  isOn: boolean;
}

export const RELAY_SLOT_COLORS: Record<SlotType | SlotSpecial, ColorName> = {
  [SlotType.A]: 'default',
  [SlotType.B]: 'info',
  [SlotType.C]: 'danger',
  [SlotSpecial.ENF]: 'grey',
  [SlotSpecial.MTO]: 'grey',
};
