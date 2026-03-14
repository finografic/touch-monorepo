/**
 * Menu Component
 *
 * Styled wrapper around Ark UI Menu using `createStyleContext`.
 * Ark handles all a11y: menu/menuitem roles, keyboard navigation,
 * arrow keys, Home/End, typeahead, Escape to close.
 *
 * Recipe variant props are accepted directly on `Menu.Root` —
 * no manual recipe call or className threading needed.
 *
 * Usage:
 * ```tsx
 * import { Menu } from '@workspace/design-system/components';
 *
 * <Menu.Root>
 *   <Menu.Trigger asChild>
 *     <button>Options</button>
 *   </Menu.Trigger>
 *   <Menu.Positioner>
 *     <Menu.Content>
 *       <Menu.Item value="edit">
 *         <Menu.ItemText>Edit</Menu.ItemText>
 *       </Menu.Item>
 *       <Menu.Separator />
 *       <Menu.Item value="delete">
 *         <Menu.ItemText>Delete</Menu.ItemText>
 *       </Menu.Item>
 *     </Menu.Content>
 *   </Menu.Positioner>
 * </Menu.Root>
 * ```
 */
import { Menu as ArkMenu } from '@ark-ui/react';
import { createStyleContext } from '@styled-system/jsx';

import { menuRecipe } from './menu.recipe';

const { withProvider, withContext } = createStyleContext(menuRecipe);

export const Menu = {
  Root: withProvider(ArkMenu.Root, 'root'),
  RootProvider: withProvider(ArkMenu.RootProvider, 'root'),
  Positioner: withContext(ArkMenu.Positioner, 'positioner'),
  Content: withContext(ArkMenu.Content, 'content'),
  Separator: withContext(ArkMenu.Separator, 'separator'),
  Item: withContext(ArkMenu.Item, 'item'),
  ItemText: withContext(ArkMenu.ItemText, 'itemText'),
  ItemIndicator: withContext(ArkMenu.ItemIndicator, 'itemIndicator'),
  ItemGroup: withContext(ArkMenu.ItemGroup, 'itemGroup'),
  ItemGroupLabel: withContext(ArkMenu.ItemGroupLabel, 'itemGroupLabel'),
  CheckboxItem: withContext(ArkMenu.CheckboxItem, 'item'),
  RadioItem: withContext(ArkMenu.RadioItem, 'item'),
  RadioItemGroup: withContext(ArkMenu.RadioItemGroup, 'itemGroup'),
  Arrow: withContext(ArkMenu.Arrow, 'arrow'),
  ArrowTip: withContext(ArkMenu.ArrowTip, 'arrowTip'),
  Indicator: withContext(ArkMenu.Indicator, 'indicator'),
  ContextTrigger: ArkMenu.ContextTrigger, // right-click context menu trigger, no recipe slot
  Context: ArkMenu.Context, // render prop
  ItemContext: ArkMenu.ItemContext, // render prop
};

export type { MenuHighlightChangeDetails, MenuOpenChangeDetails, MenuSelectionDetails } from '@ark-ui/react';
