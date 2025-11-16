import { RELAY_SLOT_COLORS, type RelayConfig } from 'types/relays.types';
import { SlotSpecial, SlotType } from 'types/slots.types';
import { colors } from 'styles';

export const getSlotColor = (config: RelayConfig) => {
  if (config.slotNumber === 14) {
    return colors[RELAY_SLOT_COLORS[SlotSpecial.ENF]];
  }
  if (config.slotNumber === 15) {
    return colors[RELAY_SLOT_COLORS[SlotSpecial.MTO]];
  }
  if (config.slotNumber === 16) {
    return colors.greyXLight75;
  }

  switch (config.slotType) {
    case SlotType.A:
      return colors.defaultLight;
    case SlotType.B:
      return colors.infoLight;
    case SlotType.C:
      return colors.dangerLight;
    default:
      return colors.defaultLight;
  }
};
