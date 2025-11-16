import { SlotSpecial, SlotType } from 'types/slots.types';
import type { ColorPalette } from 'styles/colors/palette.types';

export interface RelayConfig {
  id: string;
  slotNumber: number;
  slotType: SlotType;
  relayNumber: number | null;
  isActive: boolean;
  isOn: boolean;
}

export const RELAY_SLOT_COLORS: Record<SlotType | SlotSpecial, keyof ColorPalette> = {
  [SlotType.A]: 'defaultLight',
  [SlotType.B]: 'infoLight',
  [SlotType.C]: 'dangerLight',
  [SlotSpecial.ENF]: 'success',
  [SlotSpecial.MTO]: 'defaultLight',
};
