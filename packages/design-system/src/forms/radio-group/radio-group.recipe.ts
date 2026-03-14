/**
 * RadioGroup Recipe
 *
 * Slots:    root · label · item · itemControl · indicator · itemText · itemDescription
 * Variants: size (sm | md | lg) · variant (default | card)
 */
import { sva } from '@styled-system/css';

export const radioGroupRecipe = sva({
  className: 'radio-group',

  slots: ['root', 'label', 'item', 'itemControl', 'indicator', 'itemText', 'itemDescription'],

  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2',
    },

    label: {
      fontWeight: 'semibold',
      color: 'fg.muted',
      userSelect: 'none',
    },

    item: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '2',
      cursor: 'pointer',
      userSelect: 'none',
      _disabled: { opacity: 0.55, cursor: 'not-allowed' },
    },

    itemControl: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      borderRadius: 'full',
      borderWidth: 'light',
      borderStyle: 'solid',
      borderColor: 'border',
      bg: 'bg',
      transitionProperty: 'border-color, background-color',
      transitionDuration: 'normal',
      marginTop: '0.5',
      _checked: { borderColor: 'accent.solid', bg: 'accent.solid' },
      _hover: { borderColor: 'accent.emphasized' },
      _focusVisible: { outline: '2px solid', outlineColor: 'accent.focusRing', outlineOffset: '2px' },
    },

    indicator: {
      borderRadius: 'full',
      bg: 'white',
    },

    itemText: {
      color: 'fg',
      lineHeight: 'normal',
      fontWeight: 'medium',
    },

    itemDescription: {
      color: 'fg.muted',
      lineHeight: 'normal',
    },
  },

  variants: {
    size: {
      sm: {
        label: { fontSize: 'xs' },
        itemControl: { width: '4', height: '4' },
        indicator: { width: '1.5', height: '1.5' },
        itemText: { fontSize: 'sm' },
        itemDescription: { fontSize: 'xs' },
      },
      md: {
        label: { fontSize: 'sm' },
        itemControl: { width: '5', height: '5' },
        indicator: { width: '2', height: '2' },
        itemText: { fontSize: 'md' },
        itemDescription: { fontSize: 'sm' },
      },
      lg: {
        label: { fontSize: 'md' },
        itemControl: { width: '6', height: '6' },
        indicator: { width: '2.5', height: '2.5' },
        itemText: { fontSize: 'lg' },
        itemDescription: { fontSize: 'md' },
      },
    },

    variant: {
      default: {},
      card: {
        item: {
          padding: '3',
          borderWidth: 'light',
          borderStyle: 'solid',
          borderColor: 'border',
          borderRadius: 'md',
          bg: 'bg.panel',
          _checked: { borderColor: 'accent.solid', bg: 'accent.subtle' },
          _hover: { bg: 'bg.hover' },
        },
      },
    },

    orientation: {
      vertical: { root: { flexDirection: 'column' } },
      horizontal: { root: { flexDirection: 'row', flexWrap: 'wrap' } },
    },
  },

  defaultVariants: { size: 'md', variant: 'default', orientation: 'vertical' },
});
