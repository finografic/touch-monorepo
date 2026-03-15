import { SlotSpecial, SlotType } from 'types/slots.types';
import type { ColorsKey } from '@finografic/design-system/tokens';

export interface RelayConfig {
  id: string;
  slotNumber: number;
  slotType: SlotType;
  relayNumber: number | null;
  isActive: boolean;
  isOn: boolean;
}

export const RELAY_SLOT_COLORS: Record<SlotType | SlotSpecial, ColorsKey> = {
  [SlotType.A]: 'defaultLight',
  [SlotType.B]: 'infoLight',
  [SlotType.C]: 'dangerLight',
  [SlotSpecial.ENF]: 'success',
  [SlotSpecial.MTO]: 'defaultLight',
};
