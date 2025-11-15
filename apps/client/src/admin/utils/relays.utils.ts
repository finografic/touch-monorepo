import type { RelayConfig } from 'types/relays.types';
import { SlotType } from 'types/slots.types';

export const getRelaySlotType = (config: RelayConfig, configurations: RelayConfig[]) => {
  const numConfigs = configurations.length;
  if (!config) return 'OFF';

  log('>> CONFIG:', 'yellow', config);

  if (config.slotNumber === numConfigs) {
    return 'LAST';
  }

  return config.slotType.toString();

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
