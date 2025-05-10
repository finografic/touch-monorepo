import type { PadsConfig } from 'types/ui.types';
import type { ValidTypeBCount } from 'types/menu.types';
import type { OrderFieldKey } from 'types/orders.types';

export const NUM_ITEMS_TYPE_B: ValidTypeBCount = 8 as const;

// Base keys in camelCase - our source of truth
export const ORDER_FIELD_KEYS = [
  'home',
  'drinkType',
  'drinkSubtype',
  'drinkVolume',
  'containerType',
  'initialTemperature',
  'finalTemperature',
] as const;

export const OrderFieldKeys: { [K in OrderFieldKey]: K } = {
  home: 'home',
  drinkType: 'drinkType',
  drinkSubtype: 'drinkSubtype',
  drinkVolume: 'drinkVolume',
  containerType: 'containerType',
  initialTemperature: 'initialTemperature',
  finalTemperature: 'finalTemperature',
} as const;

export const PADS_UI_CONFIG: Partial<Record<OrderFieldKey, PadsConfig>> = {
  [OrderFieldKeys.home]: {
    maxPads: 2,
    type: 'checkbox',
    labelKey: 'name',
    minRequired: 1,
  },
  [OrderFieldKeys.drinkType]: {
    maxPads: 10,
    type: 'checkbox',
    labelKey: 'displayName',
    minRequired: 1,
  },
  [OrderFieldKeys.drinkSubtype]: {
    maxPads: 10,
    type: 'checkbox',
    labelKey: 'name',
    minRequired: 1,
  },
  [OrderFieldKeys.drinkVolume]: {
    maxPads: 10,
    type: 'checkbox',
    labelKey: 'name',
    minRequired: 1,
  },
  [OrderFieldKeys.containerType]: {
    maxPads: 10,
    type: 'checkbox',
    labelKey: 'name',
    minRequired: 1,
  },
  [OrderFieldKeys.initialTemperature]: {
    maxPads: 10,
    type: 'radio',
    labelKey: 'name',
  },
  [OrderFieldKeys.finalTemperature]: {
    maxPads: 10,
    type: 'radio',
    labelKey: 'name',
  },
};
