import type { SlotFilterKey } from 'types/orders.types';
import type { ConstMapOf } from '@workspace/core/types/utils';

/**
 * Route path constants for the main ordering flow
 * Organized by category for better maintainability
 */

// Main ordering flow routes
export const ROUTE_PATHS: ConstMapOf<SlotFilterKey, string> = {
  main: '/',
  drinkType: '/drink-type',
  drinkSubtype: '/drink-type/:drinkTypeId',
  drinkVolume: '/drink-volume',
  containerType: '/container-type',
  temperature: '/temperature',
} as const;

// Alternative flow routes (non-main flow)
export const ALTERNATIVE_PATHS = {
  time: '/time',
  help: '/help',
  settings: '/settings',
} as const;

// Admin routes
export const ADMIN_PATHS = {
  HOME: '/admin',
  DASHBOARD: '/admin/dashboard',
  LANGUAGES: '/admin/languages',
  TRANSLATIONS: '/admin/translations',
  TRANSLATIONS_UI: '/admin/translations-ui',
  ITEMS_LIST: '/admin/items-list',
} as const;

// Re-export for backward compatibility
export const PATHS = ROUTE_PATHS;

/**
 * Helper functions to build dynamic routes
 */
export const buildRoutePath = {
  drinkSubtype: (drinkTypeId: string) => `/drink-type/${drinkTypeId}`,
  adminSection: (section: string) => `/admin/${section}`,
} as const;

/**
 * Route action slugs for dynamic route generation
 */
export const ROUTE_ACTION_SLUGS = ['new', 'view', 'edit', 'create', 'delete'] as const;
