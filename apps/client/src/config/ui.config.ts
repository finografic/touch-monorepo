import { OrderFieldKeys } from 'constants/app.config';
import type { ValidTypeBCount } from 'types/menu.types';
import type { OrderFieldKey } from 'types/orders.types';
import type { PadConfig, PadUI } from 'types/ui.types';

export const NUM_ITEMS_TYPE_B: ValidTypeBCount = 8 as const;

export const PADS_UI_CONFIG: Record<OrderFieldKey, PadConfig> = {
  [OrderFieldKeys.home]: {
    type: 'checkbox',
    labelKey: 'name',
    valueKeys: ['id', 'name'],
    maxPads: 2,
    minRequired: 1,
  },
  [OrderFieldKeys.drinkType]: {
    type: 'radio',
    labelKey: 'displayName',
    valueKeys: ['id', 'name', 'hasSubtypes'],
    maxPads: 10,
    minRequired: 1,
  },
  [OrderFieldKeys.drinkSubtype]: {
    type: 'radio',
    labelKey: 'displayName',
    valueKeys: ['id', 'name'],
    maxPads: 10,
    minRequired: 1,
  },
  [OrderFieldKeys.drinkVolume]: {
    type: 'radio',
    labelKey: 'name',
    valueKeys: ['id', 'name'],
    maxPads: 10,
    minRequired: 1,
  },
  [OrderFieldKeys.containerType]: {
    type: 'radio',
    labelKey: 'displayName',
    valueKeys: ['id', 'name'],
    maxPads: 10,
    minRequired: 1,
  },
  [OrderFieldKeys.initialTemperature]: {
    type: 'radio',
    labelKey: 'displayName',
    valueKeys: ['id', 'name'],
    maxPads: 10,
    minRequired: 1,
  },
  [OrderFieldKeys.finalTemperature]: {
    type: 'radio',
    labelKey: 'displayName',
    valueKeys: ['id', 'name'],
    maxPads: 10,
    minRequired: 1,
  },
};

export const INITIAL_PAD_CHECKBOX: PadUI = {
  index: 0,
  id: '',
  label: '',
  name: '' as OrderFieldKey,
  value: {
    name: '',
    id: '',
  },
  type: 'checkbox',
  isChecked: false,
};

export const INITIAL_PAD_RADIO: PadUI = {
  index: 0,
  id: '',
  label: '',
  name: '' as OrderFieldKey,
  value: {
    name: '',
    id: '',
  },
  type: 'radio',
  isChecked: false,
};
