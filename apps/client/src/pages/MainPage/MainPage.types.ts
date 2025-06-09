import type { ValidGridSize } from 'types/menu.types';
import type { NUM_GRID_ITEMS } from 'constants/app.config';

// Define the number of grid items we're using
export type MenuGridSize = typeof NUM_GRID_ITEMS;

// Export the layout type for use in other components
export type MenuLayout = MenuGridConfig<MenuGridSize>;

/**
 * Configuration for a menu grid
 * @example
 * ```typescript
 * type Layout = MenuGridConfig<9>; // 3x3 grid
 * const config: Layout = {
 *   size: 9,
 *   mainGrid: [0, 1, 2, 3, 4, 5, 6, 7, 8],
 *   specialGrid: [9]
 * };
 * ```
 */
export interface MenuGridConfig<Size extends ValidGridSize> {
  size: Size;
  mainGrid: number[]; // indices 0-8 for main 3x3 grid
  specialGrid: number[]; // indices 9+ for special pads
}

/**
 * Creates a menu grid configuration
 * @example
 * ```typescript
 * const layout = createMenuConfig<9>({
 *   size: 9,
 *   mainGrid: [0, 1, 2, 3, 4, 5, 6, 7, 8],
 *   specialGrid: [9]
 * });
 * ```
 */
export function createMenuConfig<Size extends ValidGridSize>(config: MenuGridConfig<Size>) {
  return config;
}
