/**
 * Menu Recipe (Slot Recipe)
 *
 * Styling for Ark UI's Menu compound component.
 * Ark handles all a11y: menu/menuitem roles, keyboard navigation,
 * arrow keys, Home/End, typeahead, Escape to close.
 *
 * Slots:
 *   root           — (no visual style)
 *   trigger        — button that opens the menu
 *   positioner     — floating positioner (Ark-managed)
 *   content        — the dropdown panel
 *   separator      — horizontal divider between groups
 *   item           — a single menu row
 *   itemText       — the item's label text
 *   itemIndicator  — checkmark for checkbox/radio items
 *   itemGroup      — groups items together
 *   itemGroupLabel — the group heading
 *
 * Usage:
 * ```tsx
 * import { Menu } from '@workspace/design-system/components';
 * // cls from consuming app: menuRecipe()
 *
 * <Menu.Root>
 *   <Menu.Trigger className={cls.trigger} asChild>
 *     <button>Options <ChevronDownIcon /></button>
 *   </Menu.Trigger>
 *   <Menu.Positioner className={cls.positioner}>
 *     <Menu.Content className={cls.content}>
 *       <Menu.Item value="edit"  className={cls.item}><Menu.ItemText className={cls.itemText}>Edit</Menu.ItemText></Menu.Item>
 *       <Menu.Item value="copy" className={cls.item}><Menu.ItemText className={cls.itemText}>Copy</Menu.ItemText></Menu.Item>
 *       <Menu.Separator className={cls.separator} />
 *       <Menu.Item value="delete" className={cls.item}><Menu.ItemText className={cls.itemText}>Delete</Menu.ItemText></Menu.Item>
 *     </Menu.Content>
 *   </Menu.Positioner>
 * </Menu.Root>
 * ```
 */
import { defineSlotRecipe } from '@pandacss/dev';

export const menuRecipe = defineSlotRecipe({
  className: 'menu',
  description: 'Dropdown menu — accessible context/dropdown menu',

  slots: [
    'root', 'trigger', 'positioner', 'content',
    'separator',
    'item', 'itemText', 'itemIndicator', 'itemGroup', 'itemGroupLabel',
  ],

  base: {
    root: {},
    trigger: {},
    positioner: {
      zIndex: 'dropdown',
    },
    content: {
      bg: 'bg.panel',
      borderWidth: 'light',
      borderStyle: 'solid',
      borderColor: 'border',
      borderRadius: 'md',
      boxShadow: 'md',
      minW: '10rem',
      padding: '1',
      _open:   { animation: 'fade-in 120ms ease' },
      _closed: { animation: 'fade-out 120ms ease' },
    },
    separator: {
      height: '1px',
      bg: 'border.subtle',
      marginBlock: '1',
      marginInline: '-1',
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: '2',
      px: '3',
      py: '1.5',
      fontSize: 'sm',
      borderRadius: 'sm',
      cursor: 'pointer',
      color: 'fg',
      userSelect: 'none',
      _highlighted: { bg: 'accent.subtle', color: 'accent.fg' },
      _disabled:    { opacity: 0.55, cursor: 'not-allowed', pointerEvents: 'none' },
    },
    itemText: {
      flex: '1',
    },
    itemIndicator: {
      color: 'accent.solid',
    },
    itemGroup: {},
    itemGroupLabel: {
      fontSize: 'xs',
      fontWeight: 'semibold',
      color: 'fg.subtle',
      textTransform: 'uppercase',
      letterSpacing: 'wider',
      px: '3',
      py: '1.5',
    },
  },
});
