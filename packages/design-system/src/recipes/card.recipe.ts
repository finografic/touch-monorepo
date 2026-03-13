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
import type { RecipeProps } from 'src/types/recipes.types';

import { cva } from '../../styled-system/css';

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

export type CardRecipeProps = RecipeProps<typeof cardRecipe>;
