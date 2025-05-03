import type { ValidTypeBCount } from 'types/menu.types';
import type { PadItem } from 'types/ui.types';

export const NUM_SLOTS_TYPE_B: ValidTypeBCount = 8 as const;

export const INITIAL_PAD_CHECKBOX: PadItem = {
  id: '',
  key: '',
  label: '',
  type: 'checkbox',
  isChecked: false,
};

export const INITIAL_PAD_RADIO: PadItem = {
  id: '',
  key: '',
  label: '',
  type: 'radio',
  isChecked: false,
};
