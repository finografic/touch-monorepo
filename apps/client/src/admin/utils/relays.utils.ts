import { colors } from '@finografic/design-system/tokens';

import { RELAY_SLOT_COLORS, type RelayConfig } from 'types/relays.types';
import { SlotSpecial, SlotType } from 'types/slots.types';
import { ALT_SLOT_NUMBER } from 'config/app';

export const getRelaySlotType = (config: RelayConfig, configurations: RelayConfig[]) => {
  const numConfigs = configurations.length;
  if (!config) return 'OFF';

  if (config.slotNumber === numConfigs - 2) {
    return SlotSpecial.ENF;
  }

  if (config.slotNumber === numConfigs - 1) {
    return SlotSpecial.MTO;
  }

  if (config.slotNumber === ALT_SLOT_NUMBER) {
    return SlotSpecial.ALT;
  }

  if (config.slotNumber === numConfigs) {
    return '--';
  }

  return `Type ${config.slotType}`;
};

const getRelaySlotColor = (config: RelayConfig) => {
  if (config.slotNumber === 14) {
    return RELAY_SLOT_COLORS[SlotSpecial.ENF];
  }

  if (config.slotNumber === 15) {
    return RELAY_SLOT_COLORS[SlotSpecial.MTO];
  }

  switch (config.slotType) {
    case SlotType.A:
      return RELAY_SLOT_COLORS[SlotType.A];
    case SlotType.B:
      return RELAY_SLOT_COLORS[SlotType.B];
    case SlotType.C:
      return RELAY_SLOT_COLORS[SlotType.C];
    // case SlotSpecial.ENF:
    //   return RELAY_SLOT_COLORS[SlotSpecial.ENF];
    // case SlotSpecial.MTO:
    //   return RELAY_SLOT_COLORS[SlotSpecial.MTO];
    default:
      return RELAY_SLOT_COLORS[SlotType.A];
  }
};

const getSlotColor = (config: RelayConfig) => {
  if (config.slotNumber === 14) {
    return colors[RELAY_SLOT_COLORS[SlotSpecial.ENF]];
  }
  if (config.slotNumber === 15) {
    return colors[RELAY_SLOT_COLORS[SlotSpecial.MTO]];
  }
  if (config.slotNumber === 16) {
    return colors.greyXLight;
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
