/**
 * Tabs Slot Recipe
 *
 * Slots:    root | list | trigger | content | indicator
 * Variants: variant (line | enclosed) · size (sm | md | lg)
 */
import { sva } from '@styled-system/css';

export const tabsRecipe = sva({
  className: 'tabs',

  slots: ['root', 'list', 'trigger', 'content', 'indicator'],

  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: 'full',
    },
    list: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
    },
    trigger: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '1.5',
      fontWeight: 'semibold',
      color: 'fg.muted',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      transitionProperty: 'color, border-color',
      transitionDuration: 'fast',
      _selected: { color: 'accent.solid' },
      _hover: { color: 'fg' },
      _disabled: { opacity: 0.55, cursor: 'not-allowed', pointerEvents: 'none' },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'accent.focusRing',
        outlineOffset: '2px',
        borderRadius: 'sm',
      },
    },
    content: {
      _open: { animation: 'fade-in 150ms ease' },
    },
    indicator: {
      bg: 'accent.solid',
    },
  },

  variants: {
    variant: {
      line: {
        list: {
          borderBottomWidth: 'light',
          borderBottomStyle: 'solid',
          borderBottomColor: 'border',
          gap: '0',
        },
        trigger: {
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'transparent',
          marginBottom: '-1px',
          _selected: { borderBottomColor: 'accent.solid' },
        },
        indicator: {
          height: '2px',
          bottom: '0',
        },
      },
      enclosed: {
        list: {
          gap: '1',
          bg: 'bg.subtle',
          borderRadius: 'md',
          borderWidth: 'light',
          borderStyle: 'solid',
          borderColor: 'border',
        },
        trigger: {
          borderRadius: 'sm',
          _selected: {
            bg: 'bg.panel',
            color: 'fg',
            boxShadow: 'sm',
          },
        },
      },
    },
    size: {
      sm: {
        trigger: { px: '3', py: '1.5', fontSize: 'xs' },
        content: { pt: '3' },
        list: { p: '0.5' },
      },
      md: {
        trigger: { px: '4', py: '2', fontSize: 'sm' },
        content: { pt: '4' },
        list: { p: '1' },
      },
      lg: {
        trigger: { px: '5', py: '3', fontSize: 'md' },
        content: { pt: '5' },
        list: { p: '1' },
      },
    },
  },

  defaultVariants: {
    variant: 'line',
    size: 'md',
  },
});
