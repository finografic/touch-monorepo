/**
 * Menu Component
 *
 * Typed wrapper around Ark UI Menu.
 * Ark handles all a11y: menu/menuitem roles, keyboard navigation,
 * arrow keys, Home/End, typeahead, Escape to close.
 *
 * Styling comes from `menuRecipe` applied per slot via `className`.
 *
 * Usage:
 * ```tsx
 * import { Menu } from '@workspace/design-system/components';
 * // cls from consuming app: menuRecipe()
 *
 * <Menu.Root>
 *   <Menu.Trigger asChild>
 *     <button>Options</button>
 *   </Menu.Trigger>
 *   <Menu.Positioner className={cls.positioner}>
 *     <Menu.Content className={cls.content}>
 *       <Menu.Item value="edit" className={cls.item}>
 *         <Menu.ItemText className={cls.itemText}>Edit</Menu.ItemText>
 *       </Menu.Item>
 *       <Menu.Separator className={cls.separator} />
 *       <Menu.Item value="delete" className={cls.item}>
 *         <Menu.ItemText className={cls.itemText}>Delete</Menu.ItemText>
 *       </Menu.Item>
 *     </Menu.Content>
 *   </Menu.Positioner>
 * </Menu.Root>
 * ```
 */
import { Menu as ArkMenu } from '@ark-ui/react';

// Re-export all Ark Menu parts
export const Menu = ArkMenu;
export type { MenuSelectionDetails, MenuOpenChangeDetails } from '@ark-ui/react';
