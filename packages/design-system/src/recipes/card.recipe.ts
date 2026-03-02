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
import { defineRecipe } from '@pandacss/dev';

export const cardRecipe = defineRecipe({
  className: 'card',
  description: 'Bordered content container',

  base: {
    bg: 'bg.surface',
    borderWidth: 'light',
    borderStyle: 'solid',
    borderColor: 'border',
    borderRadius: 'md',
    overflow: 'hidden',
  },

  variants: {
    size: {
      sm: { padding: '3' },
      md: { padding: '4' },
      lg: { padding: '6' },
    },
    variant: {
      elevated: { boxShadow: 'sm' },
      outlined: {},
    },
  },

  defaultVariants: {
    size: 'md',
    variant: 'outlined',
  },
});
