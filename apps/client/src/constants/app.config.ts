import type { ValidGridSize } from 'types/menu.types';
import type { OrderFieldKey } from 'types/orders.types';

/**
 * Size of the main grid (3x3 = 9 positions)
 * Used as a reference point for grid-based calculations
 * - Main grid indices: 0 to 8
 * - Special pad at index: 9
 *
 * Matches ValidGridSize type which enforces grid sizes in multiples of 3:
 * - 9: 3x3 grid
 * - 12: 3x4 grid
 * - 15: 3x5 grid
 */
export const NUM_GRID_ITEMS: ValidGridSize = 9 as const;

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
