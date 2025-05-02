import type { PadsConfig } from 'providers/LayoutUiProvider/LayoutUiContext.types';
import type { ValidTypeBCount } from 'types/menu.types';
import type { OrderFieldKey } from 'types/orders.types';

export const NUM_SLOTS_TYPE_B: ValidTypeBCount = 8 as const;

// Base keys in camelCase - our source of truth
export const ORDER_FIELD_KEYS = [
  'drinkType',
  'drinkSubtype',
  'drinkVolume',
  'containerType',
  'initialTemperature',
  'finalTemperature',
] as const;

export const OrderFieldKeys: { [K in OrderFieldKey]: K } = {
  drinkType: 'drinkType',
  drinkSubtype: 'drinkSubtype',
  drinkVolume: 'drinkVolume',
  containerType: 'containerType',
  initialTemperature: 'initialTemperature',
  finalTemperature: 'finalTemperature',
} as const;

export const PADS_UI_CONFIG: Partial<Record<OrderFieldKey, PadsConfig>> = {
  [OrderFieldKeys.drinkType]: {
    maxPads: 10,
    type: 'radio',
    labelKey: 'name',
  },
  [OrderFieldKeys.drinkSubtype]: {
    maxPads: 10,
    type: 'radio',
    labelKey: 'name',
  },
};
