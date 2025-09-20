import type { OrderFieldKey } from 'types/orders.types';
import { OrderFieldKeys } from './app.config';

/**
 * Mapping of filter names used in the database/API
 * These keys represent the actual field names in the database schema
 */
export const FilterKeys: { [K in string]: K } = {
  drinkTypeName: 'drinkType',
  drinkSubtypeName: 'drinkSubtype',
  volumeName: 'volume',
  containerTypeName: 'containerType',
  temperatureName: 'temperatureProfile',
  defaultTempConsume: 'defaultTempConsume',
  defaultTempFreeze: 'defaultTempFreeze',
  temperatureProfileId: 'temperatureProfileId',
} as const;

/**
 * Order of filter application - used to determine which filters to apply at each step
 * This order ensures proper cascading of filters (e.g. drinkSubtype depends on drinkType)
 */
export const FILTER_ORDER: OrderFieldKey[] = [
  OrderFieldKeys.drinkType,
  OrderFieldKeys.drinkSubtype,
  OrderFieldKeys.drinkVolume,
  OrderFieldKeys.containerType,
  OrderFieldKeys.temperature,
];
