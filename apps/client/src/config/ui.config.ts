import { OrderFieldKeys } from 'constants/app.config';
import type { ValidTypeBCount } from 'types/menu.types';
import type { OrderFieldKey } from 'types/orders.types';
import type { PadConfig, PadUI } from 'types/ui.types';

export const NUM_ITEMS_TYPE_B: ValidTypeBCount = 8 as const;

export const PADS_UI_CONFIG: Record<OrderFieldKey, PadConfig> = {
  [OrderFieldKeys.home]: {
    maxPads: 2,
    type: 'checkbox',
    labelKey: 'name',
    minRequired: 1,
  },
  [OrderFieldKeys.drinkType]: {
    maxPads: 10,
    type: 'radio',
    labelKey: 'displayName',
    valueKeys: ['id', 'hasSubtypes'],
    minRequired: 1,
  },
  [OrderFieldKeys.drinkSubtype]: {
    maxPads: 10,
    type: 'radio',
    labelKey: 'displayName',
    valueKeys: ['id', 'name'],
    minRequired: 1,
  },
  [OrderFieldKeys.drinkVolume]: {
    maxPads: 10,
    type: 'radio',
    labelKey: 'name',
    valueKeys: ['id', 'name'],
    minRequired: 1,
  },
  [OrderFieldKeys.containerType]: {
    maxPads: 10,
    type: 'radio',
    labelKey: 'displayName',
    valueKeys: ['id', 'name'],
    minRequired: 1,
  },
  [OrderFieldKeys.initialTemperature]: {
    maxPads: 10,
    type: 'radio',
    labelKey: 'displayName',
    valueKeys: ['id', 'name'],
  },
  [OrderFieldKeys.finalTemperature]: {
    maxPads: 10,
    type: 'radio',
    labelKey: 'displayName',
    valueKeys: ['id', 'name'],
  },
};

export const INITIAL_PAD_CHECKBOX: PadUI = {
  index: 0,
  id: '',
  key: '',
  label: '',
  name: '',
  type: 'checkbox',
  isChecked: false,
  value: {
    name: '',
    id: '',
  },
};

export const INITIAL_PAD_RADIO: PadUI = {
  index: 0,
  id: '',
  key: '',
  label: '',
  type: 'radio',
  name: '',
  isChecked: false,
  value: {
    name: '',
    id: '',
  },
};
