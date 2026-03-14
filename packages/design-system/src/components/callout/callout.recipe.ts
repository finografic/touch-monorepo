/**
 * Callout Recipe
 *
 * Variants: status (error | warning | success | info)
 */
import { cva } from '@styled-system/css';

export const calloutRecipe = cva({
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
      error: { bg: 'bg.error', color: 'fg.error', borderColor: 'border.error' },
      warning: { bg: 'bg.warning', color: 'fg.warning', borderColor: 'border.warning' },
      success: { bg: 'bg.success', color: 'fg.success', borderColor: 'border.success' },
      info: { bg: 'bg.info', color: 'fg.info', borderColor: 'border.info' },
    },
  },

  defaultVariants: {
    status: 'info',
  },
});
