/**
 * Menu item type identifiers
 */
export type MenuItemType = 'A' | 'B' | 'C';

/**
 * Valid counts for Type B pads (must be in increments of 3, from 5 to 15)
 */
export type ValidTypeBCount = 5 | 8 | 11 | 14 | 15;

/**
 * Valid indices for Type B pads based on the total count
 * @example
 * ```typescript
 * type FivePads = TypeBIndices<5>;   // 1 | 2 | 3 | 4 | 5
 * type EightPads = TypeBIndices<8>;   // 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
 * ```
 */
export type TypeBIndices<Count extends ValidTypeBCount> = Count extends 5
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
 * type WithFiveB = TypeCStartIndex<5>;   // 6
 * type WithEightB = TypeCStartIndex<8>;   // 9
 * ```
 */
export type TypeCStartIndex<BCount extends ValidTypeBCount> = BCount extends 5
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
export interface MenuItemLayout<BCount extends ValidTypeBCount> {
  typeA: {
    index: 0;
  };
  typeB: {
    startIndex: 1;
    count: BCount;
    indices: TypeBIndices<BCount>[];
  };
  typeC: {
    startIndex: TypeCStartIndex<BCount>;
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
export type ItemTypeAtIndex<BCount extends ValidTypeBCount, Index extends number> = Index extends 0
  ? 'A'
  : Index extends TypeBIndices<BCount>
    ? 'B'
    : Index extends TypeCStartIndex<BCount>
      ? 'C'
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
export function createMenuLayout<BCount extends ValidTypeBCount>(config: MenuItemLayout<BCount>) {
  return config;
}
