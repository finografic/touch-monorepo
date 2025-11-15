import type { RelayConfig } from 'types/relays.types';
import { SlotSpecial, SlotType } from 'types/slots.types';

export const getRelaySlotType = (config: RelayConfig, configurations: RelayConfig[]) => {
  const numConfigs = configurations.length;
  if (!config) return 'OFF';

  log('>> CONFIG:', 'yellow', config);

  if (config.slotNumber === numConfigs - 2) {
    return SlotSpecial.ENF;
  }

  if (config.slotNumber === numConfigs - 1) {
    return SlotSpecial.MTO;
  }

  if (config.slotNumber === numConfigs) {
    return '--';
  }

  return config.slotType;

  // switch (config.slotType) {
  //   case SlotType.A:
  //     return colors.defaultLight;
  //   case SlotType.B:
  //     return colors.infoLight;
  //   case SlotType.C:
  //     return colors.dangerLight;
  //   default:
  //     return colors.defaultLight;
  // }

  // return config.isOn ? 'ON' : 'OFF';
};
