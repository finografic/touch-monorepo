/**
 * Toast Slot Recipe
 *
 * Slots:    root | title | description | closeTrigger | actionTrigger
 * Variants: status (info | success | warning | error)
 */
import { sva } from '@styled-system/css';

export const toastRecipe = sva({
  className: 'toast',
  slots: ['root', 'title', 'description', 'closeTrigger', 'actionTrigger'],

  base: {
    root: {
      position: 'relative',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '3',
      padding: '4',
      borderRadius: 'md',
      borderWidth: 'light',
      borderStyle: 'solid',
      boxShadow: 'md',
      minW: '18rem',
      maxW: '24rem',
      bg: 'bg.panel',
      borderColor: 'border',
      _open: { animation: 'slide-fade-in 200ms ease' },
      _closed: { animation: 'slide-fade-out 150ms ease' },
    },

    title: {
      fontWeight: 'semibold',
      fontSize: 'sm',
      color: 'fg',
      lineHeight: 'tight',
    },

    description: {
      fontSize: 'sm',
      color: 'fg.muted',
      lineHeight: 'normal',
      marginTop: '0.5',
    },

    closeTrigger: {
      marginLeft: 'auto',
      flexShrink: 0,
      cursor: 'pointer',
      color: 'fg.subtle',
      borderRadius: 'xs',
      _hover: { color: 'fg' },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'accent.focusRing',
        outlineOffset: '2px',
      },
    },

    actionTrigger: {
      fontSize: 'sm',
      fontWeight: 'semibold',
      color: 'accent',
      cursor: 'pointer',
      _hover: { color: 'accent.fg' },
    },
  },

  variants: {
    status: {
      info: {
        root: { borderLeftWidth: '4px', borderLeftColor: 'border.info' },
        title: { color: 'fg.info' },
      },
      success: {
        root: { borderLeftWidth: '4px', borderLeftColor: 'border.success' },
        title: { color: 'fg.success' },
      },
      warning: {
        root: { borderLeftWidth: '4px', borderLeftColor: 'border.warning' },
        title: { color: 'fg.warning' },
      },
      error: {
        root: { borderLeftWidth: '4px', borderLeftColor: 'border.error' },
        title: { color: 'fg.error' },
      },
    },
  },

  defaultVariants: {
    status: 'info',
  },
});
