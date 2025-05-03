import type { ValidTypeBCount } from 'types/menu.types';
import type { PadItem } from 'types/ui.types';

export const NUM_SLOTS_TYPE_B: ValidTypeBCount = 8 as const;

export const INITIAL_PAD_CHECKBOX: PadItem = {
  key: '',
  type: 'checkbox',
  isChecked: false,
};

export const INITIAL_PAD_RADIO: PadItem = {
  key: '',
  type: 'radio',
  isChecked: false,
};
