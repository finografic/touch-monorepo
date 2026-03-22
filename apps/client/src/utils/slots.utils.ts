import { colors } from '@finografic/design-system/tokens';

import type { SlotSpecialParam } from 'types/app-configuration.types';
import { RELAY_SLOT_COLORS, type RelayConfig } from 'types/relays.types';
import { SlotSpecial, SlotType } from 'types/slots.types';
import { ALT_SLOT_NUMBER, MAX_COLUMNS, MIN_COLUMNS, NUM_ROWS_DEFAULT } from 'config/app/slots.config';

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
  if (config.slotNumber === ALT_SLOT_NUMBER) {
    return colors.secondaryLight;
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

/**
 * Synthetic {@link RelayConfig} for admin “special slot” toggles — matches slot numbers used in
 * {@link getSlotColor} (grid overflow = 10/C, ALT = 16, power/ENF = 14).
 */
export function relayConfigForSpecialSlot(param: SlotSpecialParam): RelayConfig {
  const base: RelayConfig = {
    id: 'admin-slot-special-preview',
    relayNumber: null,
    isActive: true,
    isOn: false,
    slotNumber: 0,
    slotType: SlotType.A,
  };
  switch (param) {
    case 'special_grid':
      return { ...base, slotNumber: 10, slotType: SlotType.C };
    case 'special_alt':
      return { ...base, slotNumber: ALT_SLOT_NUMBER, slotType: SlotType.C };
    case 'special_power':
      return { ...base, slotNumber: 14, slotType: SlotType.A };
  }
}

/** Design-system switch palette for each slot-special control (aligned with main-page pad colors). */
export function getSpecialSlotSwitchPalette(
  param: SlotSpecialParam,
): 'danger' | 'secondary' | 'success' {
  switch (param) {
    case 'special_grid':
      return 'danger';
    case 'special_alt':
      return 'secondary';
    case 'special_power':
      return 'success';
  }
}
