import type { FilterKey } from 'types/orders.types';
import { ROUTE_FILTER_KEYS } from './app.config';

/**
 * Mapping of filter names used in the database/API
 * These keys represent the actual field names in the database schema
 */
export const API_FILTER_FIELDS: { [K in string]: K } = {
  drinkTypeName: 'drinkType',
  drinkSubtypeName: 'drinkSubtype',
  volumeName: 'volume',
  containerTypeName: 'containerType',
  temperatureName: 'temperatureProfile',
  defaultTempConsume: 'defaultTempConsume', // unused
  defaultTempFreeze: 'defaultTempFreeze', // unused
  temperatureProfileId: 'temperatureProfileId', // unused
} as const;

/**
 * Order of filter application - used to determine which filters to apply at each step
 * This order ensures proper cascading of filters (e.g. drinkSubtype depends on drinkType)
 */
export const SLOT_FILTERS: FilterKey[] = [
  ROUTE_FILTER_KEYS.drinkType,
  ROUTE_FILTER_KEYS.drinkSubtype,
  ROUTE_FILTER_KEYS.drinkVolume,
  ROUTE_FILTER_KEYS.containerType,
  ROUTE_FILTER_KEYS.temperature,
];
