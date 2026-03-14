/**
 * Card Recipe
 *
 * Variants: size (sm | md | lg) · variant (elevated | outlined)
 */
import { cva } from '@styled-system/css';

export const cardRecipe = cva({
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
