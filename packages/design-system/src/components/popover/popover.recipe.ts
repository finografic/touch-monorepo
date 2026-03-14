/**
 * Popover Slot Recipe
 *
 * Slots:    trigger | positioner | content | title | description | closeTrigger | arrow | arrowTip
 */
import { sva } from '@styled-system/css';

export const popoverRecipe = sva({
  className: 'popover',
  slots: ['trigger', 'positioner', 'content', 'title', 'description', 'closeTrigger', 'arrow', 'arrowTip'],

  base: {
    trigger: {},

    positioner: {
      zIndex: 'popover',
    },

    content: {
      position: 'relative',
      bg: 'bg.panel',
      borderWidth: 'light',
      borderStyle: 'solid',
      borderColor: 'border',
      borderRadius: 'lg',
      boxShadow: 'lg',
      padding: '4',
      maxW: '20rem',
      width: 'max-content',
      _open: { animation: 'scale-in 120ms ease' },
      _closed: { animation: 'scale-out 120ms ease' },
    },

    title: {
      fontSize: 'sm',
      fontWeight: 'semibold',
      color: 'fg',
      paddingRight: '6',
      marginBottom: '1',
    },

    description: {
      fontSize: 'sm',
      color: 'fg.muted',
      lineHeight: 'normal',
    },

    closeTrigger: {
      position: 'absolute',
      top: '3',
      right: '3',
      cursor: 'pointer',
      color: 'fg.muted',
      borderRadius: 'sm',
      _hover: {
        color: 'fg',
        bg: 'bg.subtle',
      },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'accent.focusRing',
        outlineOffset: '2px',
      },
    },

    arrow: {},

    arrowTip: {
      bg: 'bg.panel',
      borderTopWidth: '1px',
      borderLeftWidth: '1px',
      borderColor: 'border',
    },
  },
});
