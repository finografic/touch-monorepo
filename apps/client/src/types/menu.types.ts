import type { ItemType } from './orders.types';

/**
 * Valid counts for Type B pads (must be in increments of 3, from 5 to 15)
 */
export type ValidItemTypeBCount = 5 | 8 | 11 | 14 | 15;

/**
 * Valid indices for Type B pads based on the total count
 * @example
 * ```typescript
 * type FivePads = ItemTypeBIndices<5>;   // 1 | 2 | 3 | 4 | 5
 * type EightPads = ItemTypeBIndices<8>;   // 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
 * ```
 */
type ItemTypeBIndices<Count extends ValidItemTypeBCount> = Count extends 5
  ? 1 | 2 | 3 | 4 | 5
  : Count extends 8
    ? 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
    : Count extends 11
      ? 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
      : Count extends 14
        ? 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14
        : 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

/**
 * Calculates the starting index for Type C based on Type B count
 * @example
 * ```typescript
 * type WithFiveB = ItemTypeCStartIndex<5>;   // 6
 * type WithEightB = ItemTypeCStartIndex<8>;   // 9
 * ```
 */
type ItemTypeCStartIndex<BCount extends ValidItemTypeBCount> = BCount extends 5
  ? 6
  : BCount extends 8
    ? 9
    : BCount extends 11
      ? 12
      : BCount extends 14 | 15
        ? 15
        : never;

/**
 * Configuration for a menu pad layout
 * @example
 * ```typescript
 * type Layout = MenuItemLayout<8>; // 8 Type B pads
 * const config: Layout = {
 *   typeA: { index: 0 },
 *   typeB: { startIndex: 1, count: 8 },
 *   typeC: { startIndex: 9 }
 * };
 * ```
 */
// NOTE: used only in apps/client/src/pages/MenuPage/menu.types.ts
export interface MenuItemLayout<BCount extends ValidItemTypeBCount> {
  typeA: {
    index: 0;
  };
  typeB: {
    startIndex: 1;
    count: BCount;
    indices: ItemTypeBIndices<BCount>[];
  };
  typeC: {
    startIndex: ItemTypeCStartIndex<BCount>;
  };
}

/**
 * Helper type to get the pad type based on index
 * @example
 * ```typescript
 * type Layout = ItemTypeAtIndex<8, 0>;  // "A"
 * type Layout = ItemTypeAtIndex<8, 4>;  // "B"
 * type Layout = ItemTypeAtIndex<8, 9>; // "C"
 * ```
 */

// NOTE: used only in apps/client/src/pages/MenuPage/menu.types.ts
export type ItemTypeAtIndex<BCount extends ValidItemTypeBCount, Index extends number> = Index extends 0
  ? ItemType.A
  : Index extends ItemTypeBIndices<BCount>
    ? ItemType.B
    : Index extends ItemTypeCStartIndex<BCount>
      ? ItemType.C
      : never;

/**
 * Creates a menu pad configuration with type checking
 * @example
 * ```typescript
 * const layout = createMenuLayout<8>({
 *   typeA: { index: 0 },
 *   typeB: { startIndex: 1, count: 8 },
 *   typeC: { startIndex: 9 }
 * });
 * ```
 */
export function createMenuLayout<BCount extends ValidItemTypeBCount>(config: MenuItemLayout<BCount>) {
  return config;
}
