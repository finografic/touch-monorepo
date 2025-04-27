import type { MenuSlotLayout, SlotTypeAtIndex } from 'types/menu.types';
import { createMenuLayout } from 'types/menu.types';
import { NUM_SLOTS_TYPE_B } from 'constants/app.config';

// Define the number of Type B pads we're using
export type MenuBCount = typeof NUM_SLOTS_TYPE_B;

// Create and export the menu layout configuration
export const menuLayout = createMenuLayout<MenuBCount>({
  typeA: { index: 0 },
  typeB: { startIndex: 1, count: NUM_SLOTS_TYPE_B, indices: [1, 2, 3, 4, 5, 6, 7, 8] },
  typeC: { startIndex: 9 },
});

// Export the layout type for use in other components
export type MenuLayout = MenuSlotLayout<MenuBCount>;

/**
 * Get valid menu pad numbers based on their type
 */
export type ValidMenuPadNumber<T extends 'A' | 'B' | 'C'> = T extends 'A'
  ? 0
  : T extends 'B'
    ? 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
    : T extends 'C'
      ? 9 | 10 | 11
      : never;

/**
 * Get the type of a menu pad at a specific number
 */
export type MenuPadTypeAtNumber<N extends number> = SlotTypeAtIndex<MenuBCount, N>;
