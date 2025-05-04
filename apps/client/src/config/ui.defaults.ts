import type { ValidTypeBCount } from 'types/menu.types';
import type { PadUI } from 'types/ui.types';

export const NUM_ITEMS_TYPE_B: ValidTypeBCount = 8 as const;

export const INITIAL_PAD_CHECKBOX: PadUI = {
  index: 0,
  id: '',
  label: '',
  name: '',
  type: 'checkbox',
  isChecked: false,
};

export const INITIAL_PAD_RADIO: PadUI = {
  index: 0,
  id: '',
  label: '',
  type: 'radio',
  name: '',
  isChecked: false,
};
