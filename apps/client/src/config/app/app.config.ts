import type { ValidGridSize } from 'types/menu.types';
import type { FilterKey, NavigationFieldKey } from 'types/slots.types';

export const NUM_GRID_ITEMS: ValidGridSize = 10 as const; // Now 1-based: 1-9

export const CONFIG_EXPIRY_TIME_MS = 3_600_000; // 1 hour
export const SNOOZE_INTERVAL_MS = 120_000; // 2 minutes

/** Default idle duration before the admin screensaver overlay appears (milliseconds). */
/** Fade in/out duration for the admin screensaver overlay (milliseconds). */
export const ADMIN_SCREENSAVER_INACTIVITY_MS = 5_000 * 60; // 5 minutes
export const ADMIN_SCREENSAVER_TRANSITION_MS = 300;

export const POLLING_INTERVAL_1MS = 1_000; // 1 second
export const POLLING_INTERVAL_MS = 1_000; // 1 second (UI update frequency)

export const STORAGE_KEYS = {
  LAST_CONFIG: 'touch_last_config',
  CONFIG_TIMESTAMP: 'touch_config_timestamp',
  SNOOZE_TIMESTAMP: 'touch_snooze_timestamp',
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
export const ROUTE_FILTER_KEYS: { [K in FilterKey | NavigationFieldKey]: K } = {
  main: 'main',
  mode: 'mode',
  drinkType: 'drinkType',
  drinkSubtype: 'drinkSubtype',
  drinkVolume: 'drinkVolume',
  containerType: 'containerType',
  temperature: 'temperature',
} as const;

/**
 * Type-safe mapping of field keys to themselves
 * Useful for strongly-typed object access
 */
export const AdminRouteIds: { [K in string]: K } = {
  dashboard: 'dashboard',

  // PUBLIC ENTRIES
  mode: 'mode', // public only
  languages: 'languages',
  sounds: 'sounds',
  maintenance: 'maintenance', // relays (public)

  // AUTHENTICATED ENTRIES (only visible as admin)
  items: 'items', // orders
  translationsProduct: 'translationsProduct', // translations
  translationsUi: 'translations-ui', // translations
  translationsApp: 'translations-app', // translations
  translationsAdmin: 'translations-admin', // translations
  slots: 'slots',
  relays: 'relays',
} as const;
