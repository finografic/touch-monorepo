import type { CamelToKebab, CamelToSnake } from '../utilities/casing.utils.types';

// Base keys in camelCase - our source of truth
export const ORDER_FIELD_KEYS = [
  'drinkType',
  'drinkSubtype',
  'volume',
  'containerType',
  'initialTemperature',
  'finalTemperature',
] as const;

export type OrderFieldKey = (typeof ORDER_FIELD_KEYS)[number];
export type OrderFieldKebabCase = CamelToKebab<OrderFieldKey>;
export type OrderFieldSnakeCase = CamelToSnake<OrderFieldKey>;

// Type-safe object with both formats
export const OrderFields = {
  camel: {
    drinkType: 'drinkType',
    drinkSubtype: 'drinkSubtype',
    volume: 'volume',
    containerType: 'containerType',
    initialTemperature: 'initialTemperature',
    finalTemperature: 'finalTemperature',
  },
  kebab: {
    drinkType: 'drink-type',
    drinkSubtype: 'drink-subtype',
    volume: 'volume',
    containerType: 'container-type',
    initialTemperature: 'initial-temperature',
    finalTemperature: 'final-temperature',
  },
} as const;

// Type helpers for accessing the constant values
export type OrderFieldsCamel = typeof OrderFields.camel;
export type OrderFieldsKebab = typeof OrderFields.kebab;
