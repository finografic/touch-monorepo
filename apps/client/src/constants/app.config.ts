import type { ValidGridSize } from 'types/menu.types';
import type { OrderFieldKey } from 'types/orders.types';
import type { LangCode } from '@workspace/types';

// Core application configuration
export const NUM_GRID_ITEMS: ValidGridSize = 9 as const;
export const DEFAULT_LANGUAGE: LangCode = 'es' as const;

// Language configuration for this project
// Set to override browser language detection and force Spanish as default
export const FORCE_DEFAULT_LANGUAGE: LangCode = 'es' as const;
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
export const OrderFieldKeys: { [K in OrderFieldKey]: K } = {
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
  languages: 'languages',
  translations: 'translations',
} as const;
