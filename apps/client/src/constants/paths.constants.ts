import type { OrderFieldKey } from 'types/orders.types';
import type { ConstMapOf } from '@workspace/core/types/utils';

/**
 * Client-specific path constants
 * Organized by category for better maintainability
 */

// Route paths for the main ordering flow
export const ROUTE_PATHS: ConstMapOf<OrderFieldKey, string> = {
  main: '/',
  drinkType: '/drink-type',
  drinkSubtype: '/drink-type/:drinkTypeId',
  drinkVolume: '/drink-volume',
  containerType: '/container-type',
  temperature: '/temperature',
} as const;

// Alternative and admin routes
export const ADMIN_PATHS = {
  ADMIN_HOME: '/admin',
  DASHBOARD: '/admin/dashboard',
  LANGUAGES: '/admin/languages',
  TRANSLATIONS: '/admin/translations',
  TRANSLATIONS_UI: '/admin/translations-ui',
  ITEMS_LIST: '/admin/items-list',
} as const;

// Additional flow paths
export const FLOW_PATHS = {
  TIME: '/time',
  HELP: '/help',
  SETTINGS: '/settings',
} as const;

// API endpoint paths (client-side API calls)
export const API_PATHS = {
  AUTH: '/api/auth',
  ORDERS: '/api/orders',
  SOUNDS: '/api/sounds',
  TRANSLATIONS: '/api/translations',
  UI_LABELS: '/api/ui-labels',
} as const;

// Asset paths
export const ASSET_PATHS = {
  IMAGES: '/images',
  ICONS: '/icons',
  SOUNDS: '/sounds',
  FONTS: '/fonts',
} as const;

/**
 * All client path constants grouped by category
 */
export const CLIENT_PATHS = {
  ROUTES: ROUTE_PATHS,
  ADMIN: ADMIN_PATHS,
  FLOWS: FLOW_PATHS,
  API: API_PATHS,
  ASSETS: ASSET_PATHS,
} as const;

/**
 * Helper function to build dynamic routes
 */
export const buildRoutePath = {
  drinkSubtype: (drinkTypeId: string) => `/drink-type/${drinkTypeId}`,
  adminSection: (section: string) => `/admin/${section}`,
} as const;
