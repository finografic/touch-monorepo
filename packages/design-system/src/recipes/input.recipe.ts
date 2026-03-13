/**
 * Input Recipe
 *
 * Base styles for text inputs, selects, and textareas.
 * Designed to work with Ark UI form primitives.
 *
 * Usage:
 * ```tsx
 * <input className={inputRecipe({ size: 'md' })} type="text" />
 * <input className={inputRecipe({ size: 'md', leadingIcon: true })} type="text" />
 * ```
 */
import type { RecipeProps } from 'src/types/recipes.types';

import { cva } from '../../styled-system/css';

export const inputRecipe = cva({
  base: {
    display: 'flex',
    width: '100%',
    borderWidth: 'default',
    borderStyle: 'solid',
    borderColor: 'border',
    borderRadius: 'md',
    bg: 'bg',
    color: 'fg',
    fontWeight: 'normal',
    outline: 0,
    transitionProperty: 'border-color, box-shadow',
    transitionDuration: 'normal',

    _placeholder: {
      color: 'fg.subtle',
    },

    _focusVisible: {
      borderColor: 'accent.solid',
      boxShadow: '0 0 0 1px var(--colors-accent-focus-ring)',
    },

    _disabled: {
      opacity: 0.55,
      cursor: 'not-allowed',
    },

    _invalid: {
      borderColor: 'border.error',
      _focusVisible: {
        boxShadow: '0 0 0 1px var(--colors-fg-error)',
      },
    },
  },

  variants: {
    size: {
      sm: {
        height: '9',
        fontSize: 'sm',
        paddingInline: '1',
      },
      md: {
        height: '10',
        fontSize: 'sm',
        paddingInline: '4',
      },
      lg: {
        height: '12',
        fontSize: 'md',
        paddingInline: '5',
      },
    },

    leadingIcon: {
      true: {
        paddingInlineStart: '8',
      },
    },

    trailingIcon: {
      true: {
        paddingInlineEnd: '8',
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

export type InputRecipeProps = RecipeProps<typeof inputRecipe>;
