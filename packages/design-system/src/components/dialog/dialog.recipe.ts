/**
 * Dialog Slot Recipe
 *
 * Slots:    backdrop | positioner | content | header | title | description | body | footer | closeTrigger
 * Variants: size (sm | md | lg | xl | full)
 */
import { sva } from '@styled-system/css';

export const dialogRecipe = sva({
  className: 'dialog',
  slots: [
    'backdrop',
    'positioner',
    'content',
    'header',
    'title',
    'description',
    'body',
    'footer',
    'closeTrigger',
  ],

  base: {
    backdrop: {
      position: 'fixed',
      inset: '0',
      bg: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(2px)',
      zIndex: 'overlay',
      _open: { animation: 'fade-in 150ms ease' },
      _closed: { animation: 'fade-out 150ms ease' },
    },

    positioner: {
      position: 'fixed',
      inset: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4',
      zIndex: 'modal',
    },

    content: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      bg: 'bg.panel',
      borderRadius: 'lg',
      boxShadow: 'lg',
      width: 'full',
      maxH: '90vh',
      overflow: 'hidden',
      _open: { animation: 'scale-in 150ms ease' },
      _closed: { animation: 'scale-out 150ms ease' },
    },

    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '4',
      paddingInline: '6',
      paddingBlock: '4',
      borderBottomWidth: 'light',
      borderBottomStyle: 'solid',
      borderBottomColor: 'border.subtle',
      flexShrink: 0,
    },

    title: {
      fontSize: 'xl',
      fontWeight: 'semibold',
      color: 'fg',
      lineHeight: 'tight',
    },

    description: {
      fontSize: 'sm',
      color: 'fg.muted',
      lineHeight: 'normal',
    },

    body: {
      flex: '1',
      overflowY: 'auto',
      padding: '6',
    },

    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: '3',
      paddingInline: '6',
      paddingBlock: '4',
      borderTopWidth: 'light',
      borderTopStyle: 'solid',
      borderTopColor: 'border.subtle',
      flexShrink: 0,
    },

    closeTrigger: {
      cursor: 'pointer',
      color: 'fg.muted',
      borderRadius: 'sm',
      _hover: { color: 'fg', bg: 'bg.subtle' },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'accent.focusRing',
        outlineOffset: '2px',
      },
    },
  },

  variants: {
    size: {
      sm: { content: { maxW: '24rem' } },
      md: { content: { maxW: '32rem' } },
      lg: { content: { maxW: '48rem' } },
      xl: { content: { maxW: '64rem' } },
      full: {
        positioner: { padding: '0' },
        content: { maxW: 'full', maxH: 'full', borderRadius: 'none' },
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});
