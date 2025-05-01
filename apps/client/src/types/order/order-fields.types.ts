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
    'drink-type': 'drink-type',
    'drink-subtype': 'drink-subtype',
    'volume': 'volume',
    'container-type': 'container-type',
    'initial-temperature': 'initial-temperature',
    'final-temperature': 'final-temperature',
  },
  snake: {
    drink_type: 'drink_type',
    drink_subtype: 'drink_subtype',
    volume: 'volume',
    container_type: 'container_type',
    initial_temperature: 'initial_temperature',
    final_temperature: 'final_temperature',
  },
} as const;

// Type helpers for accessing the constant values
export type OrderFieldsCamel = typeof OrderFields.camel;
export type OrderFieldsKebab = typeof OrderFields.kebab;
export type OrderFieldsSnake = typeof OrderFields.snake;

// ------------------------------------------------------------------------ //

// Helper type to ensure both objects have matching keys (after case conversion)
type ValidateFieldMapping<TCamel extends Record<string, string>, TKebab extends Record<string, string>> = {
  [K in keyof TCamel & string]: CamelToKebab<K> extends keyof TKebab ? true : never;
}[keyof TCamel & string] extends true
  ? true
  : false;

// Type assertion to ensure our mapping is valid
export type __IsValidMapping = ValidateFieldMapping<typeof OrderFields.camel, typeof OrderFields.kebab>;

// Usage example type (you can remove this comment and example)
export interface __Example {
  // All of these will work and be type-safe:
  camelKey: keyof OrderFieldsCamel; // "drinkType" | "drinkSubtype" | ...
  kebabKey: keyof OrderFieldsKebab; // "drink-type" | "drink-subtype" | ...
  snakeKey: keyof OrderFieldsSnake; // "drink_type" | "drink_subtype" | ...
}
