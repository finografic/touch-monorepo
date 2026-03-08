import { RELAY_SLOT_COLORS, type RelayConfig } from 'types/relays.types';
import { SlotSpecial, SlotType } from 'types/slots.types';
import { MAX_COLUMNS, MIN_COLUMNS, NUM_ROWS_DEFAULT } from 'config/app/slots.config';
import { colors } from '@workspace/design-system/tokens';

/**
 * Computes how many columns are needed to fit all slots (except special slot),
 * using NUM_ROWS_DEFAULT rows per column.
 */
export const calculateColumns = (activeSlotCount: number): number => {
  const usableSlots = Math.max(0, activeSlotCount - 1);
  const rawCols = Math.ceil(usableSlots / NUM_ROWS_DEFAULT);

  return Math.max(MIN_COLUMNS, Math.min(MAX_COLUMNS, rawCols));
};

export const getSlotColor = (config: RelayConfig) => {
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
