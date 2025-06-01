import type { ValidTypeBCount } from 'types/menu.types';
import type { OrderFieldKey } from 'types/orders.types';

export const NUM_ITEMS_TYPE_B: ValidTypeBCount = 8 as const;

/**
 * Base keys in camelCase - our source of truth for order field keys
 * These are used to derive other constants and types
 */
export const ORDER_FIELD_KEYS = [
  'home',
  'drinkType',
  'drinkSubtype',
  'drinkVolume',
  'containerType',
  'temperature',
  // 'initialTemperature',
  // 'finalTemperature',
] as const;

/**
 * Type-safe mapping of field keys to themselves
 * Useful for strongly-typed object access
 */
export const OrderFieldKeys: { [K in OrderFieldKey]: K } = {
  home: 'home',
  drinkType: 'drinkType',
  drinkSubtype: 'drinkSubtype',
  drinkVolume: 'drinkVolume',
  containerType: 'containerType',
  temperature: 'temperature',
  // initialTemperature: 'initialTemperature',
  // finalTemperature: 'finalTemperature',
} as const;

// export const FilterKeys: { [K in string]: K } = {
//   drinkTypeName: 'drinkTypeName',
//   drinkSubtypeName: 'drinkSubtypeName',
//   volumeName: 'volumeName',
//   containerTypeName: 'containerTypeName',
//   temperatureName: 'temperatureName',
//   defaultTempConsume: 'defaultTempConsume',
//   // initialTemperatureName: 'initialTemperatureName',
//   // finalTemperatureName: 'finalTemperatureName',
// } as const;

// export type FilterKey = keyof typeof FilterKeys;
