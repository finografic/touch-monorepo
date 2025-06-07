import type { CamelToKebab, CamelToSnake } from '@workspace/types/utils';

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
export type OrderFieldKebab = CamelToKebab<OrderFieldKey>;
export type OrderFieldSnake = CamelToSnake<OrderFieldKey>;
