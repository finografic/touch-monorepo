/**
 * Card Recipe
 *
 * Simple bordered/shadowed content container.
 * Replaces Radix Themes <Card>.
 *
 * Usage:
 * ```tsx
 * import { card } from 'styled-system/recipes';
 *
 * <div className={card()}>...</div>
 * <div className={card({ size: 'lg', variant: 'elevated' })}>...</div>
 * ```
 */
import { sva } from '../../styled-system/css';

export const cardRecipe = sva({
  className: 'card',

  slots: ['root'],

  base: {
    root: {
      bg: 'bg.surface',
      borderWidth: 'light',
      borderStyle: 'solid',
      borderColor: 'border',
      borderRadius: 'md',
      overflow: 'hidden',
    },
  },

  variants: {
    size: {
      sm: { root: { padding: '3' } },
      md: { root: { padding: '4' } },
      lg: { root: { padding: '6' } },
    },

    variant: {
      elevated: { root: { boxShadow: 'sm' } },
      outlined: { root: {} },
    },
  },

  defaultVariants: {
    size: 'md',
    variant: 'outlined',
  },
});
