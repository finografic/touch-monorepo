/**
 * Select Recipe (Slot Recipe)
 *
 * Styling for Ark UI's Select compound component.
 * Ark handles all a11y: combobox role, keyboard navigation,
 * listbox/option roles, aria-selected, aria-expanded.
 *
 * Slots:
 *   root           — outer container (label + control stacked)
 *   label          — visible label above the trigger
 *   control        — wrapper for trigger + clearTrigger
 *   trigger        — the button that opens the dropdown
 *   valueText      — the selected value / placeholder text
 *   indicator      — chevron/caret icon
 *   positioner     — floating positioner (Ark-managed)
 *   content        — the dropdown panel
 *   list           — the <ul> of items
 *   item           — a single option row
 *   itemText       — the item's label text
 *   itemIndicator  — checkmark shown when selected
 *   itemGroup      — groups items under a shared label
 *   itemGroupLabel — the group heading
 *   clearTrigger   — × button to clear selection
 *
 * Usage:
 * ```tsx
 * import { Select } from '@workspace/design-system/components';
 * import { createListCollection } from '@ark-ui/react';
 * // cls from consuming app: selectRecipe({ size: 'md' })
 *
 * const items = createListCollection({ items: ['React', 'Vue', 'Svelte'] });
 *
 * <Select.Root collection={items} onValueChange={({ value }) => console.log(value)}>
 *   <Select.Label className={cls.label}>Framework</Select.Label>
 *   <Select.Control className={cls.control}>
 *     <Select.Trigger className={cls.trigger}>
 *       <Select.ValueText className={cls.valueText} placeholder="Pick one…" />
 *       <Select.Indicator className={cls.indicator}><ChevronDownIcon /></Select.Indicator>
 *     </Select.Trigger>
 *     <Select.ClearTrigger className={cls.clearTrigger}><XIcon /></Select.ClearTrigger>
 *   </Select.Control>
 *   <Select.Positioner className={cls.positioner}>
 *     <Select.Content className={cls.content}>
 *       <Select.List className={cls.list}>
 *         {items.items.map(item => (
 *           <Select.Item key={item} item={item} className={cls.item}>
 *             <Select.ItemText className={cls.itemText}>{item}</Select.ItemText>
 *             <Select.ItemIndicator className={cls.itemIndicator}><CheckIcon /></Select.ItemIndicator>
 *           </Select.Item>
 *         ))}
 *       </Select.List>
 *     </Select.Content>
 *   </Select.Positioner>
 *   <Select.HiddenSelect />
 * </Select.Root>
 * ```
 */
import type { RecipeProps } from 'src/types/recipes.types';

import { sva } from '../../styled-system/css';

export const selectRecipe = sva({
  slots: [
    'root',
    'label',
    'control',
    'trigger',
    'valueText',
    'indicator',
    'positioner',
    'content',
    'list',
    'item',
    'itemText',
    'itemIndicator',
    'itemGroup',
    'itemGroupLabel',
    'clearTrigger',
  ],

  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5',
      width: 'full',
    },

    label: {
      fontWeight: 'semibold',
      color: 'fg.muted',
      userSelect: 'none',
    },

    control: {
      display: 'flex',
      alignItems: 'center',
      gap: '1',
      width: 'full',
    },

    trigger: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: 'full',
      borderWidth: 'light',
      borderStyle: 'solid',
      borderColor: 'border',
      borderRadius: 'md',
      bg: 'bg.panel',
      color: 'fg',
      cursor: 'pointer',
      gap: '2',
      transitionProperty: 'border-color, box-shadow',
      transitionDuration: 'fast',

      _placeholder: {
        color: 'fg.subtle',
      },

      _hover: {
        borderColor: 'accent.emphasized',
      },

      _open: {
        borderColor: 'accent.solid',
        outline: '2px solid',
        outlineColor: 'accent.focusRing',
        outlineOffset: '2px',
      },

      _disabled: {
        opacity: 0.55,
        cursor: 'not-allowed',
      },

      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'accent.focusRing',
        outlineOffset: '2px',
      },
    },

    valueText: {
      flex: '1',
      textAlign: 'start',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },

    indicator: {
      color: 'fg.muted',
      flexShrink: 0,
      transition: 'transform 150ms ease',

      _open: {
        transform: 'rotate(180deg)',
      },
    },

    positioner: {
      zIndex: 'dropdown',
      width: 'var(--reference-width)',
    },

    content: {
      bg: 'bg.panel',
      borderWidth: 'light',
      borderStyle: 'solid',
      borderColor: 'border',
      borderRadius: 'md',
      boxShadow: 'md',
      overflowY: 'auto',
      maxH: '15rem',

      _open: {
        animation: 'fade-in 120ms ease',
      },

      _closed: {
        animation: 'fade-out 120ms ease',
      },
    },

    list: {
      display: 'flex',
      flexDirection: 'column',
      padding: '1',
    },

    item: {
      display: 'flex',
      alignItems: 'center',
      gap: '2',
      borderRadius: 'sm',
      cursor: 'pointer',
      color: 'fg',
      userSelect: 'none',

      _highlighted: {
        bg: 'accent.subtle',
        color: 'accent.fg',
      },

      _selected: {
        fontWeight: 'semibold',
      },

      _disabled: {
        opacity: 0.55,
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
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
    },

    clearTrigger: {
      color: 'fg.muted',
      cursor: 'pointer',
      flexShrink: 0,
      borderRadius: 'sm',

      _hover: {
        color: 'fg',
      },
    },
  },

  variants: {
    size: {
      sm: {
        label: { fontSize: 'xs' },
        trigger: { h: '8', px: '2.5', fontSize: 'sm', gap: '1.5' },
        item: { px: '2', py: '1', fontSize: 'sm' },
        itemGroupLabel: { px: '2', py: '1' },
        itemIndicator: { w: '3', h: '3' },
      },

      md: {
        label: { fontSize: 'sm' },
        trigger: { h: '10', px: '3', fontSize: 'sm', gap: '2' },
        item: { px: '3', py: '1.5', fontSize: 'sm' },
        itemGroupLabel: { px: '3', py: '1.5' },
        itemIndicator: { w: '4', h: '4' },
      },

      lg: {
        label: { fontSize: 'md' },
        trigger: { h: '11', px: '4', fontSize: 'md', gap: '2' },
        item: { px: '3', py: '2', fontSize: 'md' },
        itemGroupLabel: { px: '3', py: '2' },
        itemIndicator: { w: '4', h: '4' },
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

export type SelectRecipeProps = RecipeProps<typeof selectRecipe>;
