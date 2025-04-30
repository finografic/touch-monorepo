import type { ValidTypeBCount } from 'types/menu.types';
import type { PadItem } from 'types/ui.types';

export const NUM_SLOTS_TYPE_B: ValidTypeBCount = 8 as const;

export const INITIAL_PAD_CHECKBOX: PadItem = {
  index: 0,
  id: '',
  type: 'checkbox',
  isChecked: false,
};

export const INITIAL_PAD_RADIO: PadItem = {
  index: 0,
  id: '',
  type: 'radio',
  isChecked: false,
};
