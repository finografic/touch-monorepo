import type { ValidGridSize } from 'types/menu.types';
import type { SlotFilterKey } from 'types/orders.types';
import type { RegionLocale } from '@workspace/i18n';

// Core application configuration
export const NUM_GRID_ITEMS: ValidGridSize = 10 as const; // Now 1-based: 1-9
export const DEFAULT_LANGUAGE: RegionLocale = 'es-ES' as const; // Updated to locale format

// Language configuration for this project
// Set to override browser language detection and force Spanish as default
export const FORCE_DEFAULT_LANGUAGE: RegionLocale = 'es-ES' as const; // Updated to locale format
export const ENABLE_BROWSER_LANGUAGE_DETECTION = false as const;

// Configuration expiry time (1 hour in milliseconds)
export const CONFIG_EXPIRY_TIME_MS = 3_600_000;

// Session storage keys
export const STORAGE_KEYS = {
  LAST_CONFIG: 'touch_last_config',
  CONFIG_TIMESTAMP: 'touch_config_timestamp',
} as const;

/**
 * Base keys in camelCase - our source of truth for order field keys
 * These are used to derive other constants and types
 */
export const ORDER_FIELD_KEYS = [
  'main',
  'drinkType',
  'drinkSubtype',
  'drinkVolume',
  'containerType',
  'temperature',
] as const;

/**
 * Type-safe mapping of field keys to themselves
 * Useful for strongly-typed object access
 */
export const ROUTE_FILTER_KEYS: { [K in SlotFilterKey]: K } = {
  main: 'main',
  drinkType: 'drinkType',
  drinkSubtype: 'drinkSubtype',
  drinkVolume: 'drinkVolume',
  containerType: 'containerType',
  temperature: 'temperature',
} as const;

// ======================================================================== //

/**
 * Type-safe mapping of field keys to themselves
 * Useful for strongly-typed object access
 */
export const AdminFieldKeys: { [K in string]: K } = {
  dashboard: 'dashboard',
  languages: 'languages',
  translations: 'translations',
  translationsUi: 'translationsUi',
  itemsList: 'itemsList',
} as const;
