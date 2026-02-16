/**
 * Callout Recipe
 *
 * Replaces Radix Themes <Callout.Root> + <Callout.Text>.
 * A simple role="alert" div — no compound components needed.
 *
 * Usage:
 * ```tsx
 * <div className={calloutRecipe({ status: 'error' })} role="alert">
 *   Something went wrong.
 * </div>
 * ```
 */
import { defineRecipe } from '@pandacss/dev';

export const calloutRecipe = defineRecipe({
  className: 'callout',
  description: 'Status message banner for errors, warnings, success, and info',

  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '3',
    padding: '4',
    borderRadius: 'md',
    borderWidth: 'light',
    borderStyle: 'solid',
    fontWeight: 'medium',
    fontSize: 'sm',
    lineHeight: 'normal',
  },

  variants: {
    status: {
      error: {
        bg: 'bg.error',
        color: 'fg.error',
        borderColor: 'border.error',
      },
      warning: {
        bg: 'bg.warning',
        color: 'fg.warning',
        borderColor: 'border.warning',
      },
      success: {
        bg: 'bg.success',
        color: 'fg.success',
        borderColor: 'border.success',
      },
      info: {
        bg: 'bg.info',
        color: 'fg.info',
        borderColor: 'border.info',
      },
    },
  },

  defaultVariants: {
    status: 'info',
  },
});
