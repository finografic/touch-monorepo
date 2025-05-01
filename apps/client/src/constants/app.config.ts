import type { ValidTypeBCount } from 'types/menu.types';
import type { OrderField } from 'types/orders.types';

export const NUM_SLOTS_TYPE_B: ValidTypeBCount = 8 as const;

// Base keys in camelCase - our source of truth
export const ORDER_FIELD_KEYS = [
  'drinkType',
  'drinkSubtype',
  'volume',
  'containerType',
  'initialTemperature',
  'finalTemperature',
] as const;

export const OrderFieldKeys: { [K in OrderField]: K } = {
  drinkType: 'drinkType',
  drinkSubtype: 'drinkSubtype',
  volume: 'volume',
  containerType: 'containerType',
  initialTemperature: 'initialTemperature',
  finalTemperature: 'finalTemperature',
} as const;
