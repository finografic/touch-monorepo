import type { ItemTypeAtIndex, MenuItemLayout } from 'types/menu.types';
import type { NUM_ITEMS_TYPE_B } from 'constants/app.config';
import type { OrderItemType } from 'types/orders.types';

// Define the number of Type B pads we're using
export type MenuBCount = typeof NUM_ITEMS_TYPE_B;

// Export the layout type for use in other components
export type MenuLayout = MenuItemLayout<MenuBCount>;

/**
 * Get valid menu pad numbers based on their type
 */
export type ValidMenuPadNumber<T extends OrderItemType> = T extends 'A'
  ? 0
  : T extends 'B'
    ? 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
    : T extends 'C'
      ? 9 | 10 | 11
      : never;

/**
 * Get the type of a menu pad at a specific number
 */
export type MenuPadTypeAtNumber<N extends number> = ItemTypeAtIndex<MenuBCount, N>;
