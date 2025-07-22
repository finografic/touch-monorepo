/**
 * Valid counts for menu grid items (must be in multiples of 3)
 * Each row has 3 items, and we can have 3, 4, or 5 rows
 */
export type ValidGridSize = 9 | 12 | 15;

/**
 * Valid indices for menu items based on grid size
 * @example
 * ```typescript
 * type NineGrid = ValidGridIndices<9>;   // 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
 * type TwelveGrid = ValidGridIndices<12>; // 1 | 2 | ... | 12
 * ```
 */
type ValidGridIndices<Count extends ValidGridSize> = Count extends 9
  ? 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  : Count extends 12
    ? 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    : 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

/**
 * Configuration for a menu grid layout
 * @example
 * ```typescript
 * type Layout = MenuGridLayout<9>; // 3x3 grid
 * const config: Layout = {
 *   size: 9,
 *   indices: [1, 2, 3, 4, 5, 6, 7, 8, 9]
 * };
 * ```
 */
export interface MenuGridLayout<Size extends ValidGridSize> {
  size: Size;
  indices: ValidGridIndices<Size>[];
}

/**
 * Creates a menu grid configuration with type checking
 * @example
 * ```typescript
 * const layout = createMenuLayout<9>({
 *   size: 9,
 *   indices: [1, 2, 3, 4, 5, 6, 7, 8, 9]
 * });
 * ```
 */
export function createMenuLayout<Size extends ValidGridSize>(config: MenuGridLayout<Size>) {
  return config;
}
