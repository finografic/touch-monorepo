/**
 * Menu Slot Recipe
 *
 * Slots:    root | positioner | content | separator | item | itemText | itemIndicator | itemGroup | itemGroupLabel | arrow | arrowTip | indicator
 */
import { sva } from '@styled-system/css';

export const menuRecipe = sva({
  className: 'menu',
  slots: [
    'root',
    'positioner',
    'content',
    'separator',
    'item',
    'itemText',
    'itemIndicator',
    'itemGroup',
    'itemGroupLabel',
    'arrow',
    'arrowTip',
    'indicator',
  ],

  base: {
    root: {},

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
      _open: { animation: 'fade-in 120ms ease' },
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
      _highlighted: {
        bg: 'accent.subtle',
        color: 'accent.fg',
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
      px: '3',
      py: '1.5',
    },

    arrow: {},
    arrowTip: {},
    indicator: {},
  },
});
