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
  },
  [OrderFieldKeys.drinkType]: {
    maxPads: 10,
    type: 'radio',
    labelKey: 'displayName',
  },
  [OrderFieldKeys.drinkSubtype]: {
    maxPads: 10,
    type: 'radio',
    labelKey: 'name',
  },
};
