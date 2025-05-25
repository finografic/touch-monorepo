import { FilterKeys, OrderFieldKeys } from 'constants/app.config';
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
    filterKey: FilterKeys.drinkTypeName,
    type: 'radio',
    labelKey: 'displayName',
    valueKeys: ['id', 'name', 'hasSubtypes', 'temperatureConsume', 'temperatureFreeze'],
    maxPads: 10,
    minRequired: 1,
  },
  [OrderFieldKeys.drinkSubtype]: {
    filterKey: FilterKeys.drinkSubtypeName,
    type: 'radio',
    labelKey: 'displayName',
    valueKeys: ['id', 'name', 'temperatureConsume', 'temperatureFreeze'],
    maxPads: 10,
    minRequired: 1,
  },
  [OrderFieldKeys.drinkVolume]: {
    filterKey: FilterKeys.volumeName,
    type: 'radio',
    labelKey: 'name',
    valueKeys: ['id', 'name'],
    maxPads: 10,
    minRequired: 1,
  },
  [OrderFieldKeys.containerType]: {
    filterKey: FilterKeys.containerTypeName,
    type: 'radio',
    labelKey: 'displayName',
    valueKeys: ['id', 'name'],
    maxPads: 10,
    minRequired: 1,
  },
  [OrderFieldKeys.temperature]: {
    filterKey: FilterKeys.temperature,
    type: 'radio',
    labelKey: 'displayName',
    valueKeys: ['id', 'name'],
    maxPads: 10,
    minRequired: 1,
  },
  /*
  [OrderFieldKeys.initialTemperature]: {
    filterKey: FilterKeys.initialTemperatureName,
    type: 'radio',
    labelKey: 'displayName',
    valueKeys: ['id', 'name'],
    maxPads: 10,
    minRequired: 1,
  },
  [OrderFieldKeys.finalTemperature]: {
    filterKey: FilterKeys.finalTemperatureName,
    type: 'radio',
    labelKey: 'displayName',
    valueKeys: ['id', 'name'],
    maxPads: 10,
    minRequired: 1,
  },
  */
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
