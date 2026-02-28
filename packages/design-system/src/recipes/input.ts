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
import { defineRecipe } from '@pandacss/dev';

export const inputRecipe = defineRecipe({
  className: 'input',
  description: 'Form input field with size variants',

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
        paddingInline: '3',
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

    // ── Icon slot padding ──────────────────────────────────────────────
    // Use when an icon is absolutely positioned inside the input wrapper.
    // Shifts the matching side's padding to prevent text/icon overlap.
    // (Not needed when using the InputField compound — it uses flexbox.)
    leadingIcon: {
      true: { paddingInlineStart: '8' },
    },
    trailingIcon: {
      true: { paddingInlineEnd: '8' },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});
