/**
 * Label Recipe
 *
 * Styles for form field labels. Size variants align with input sizes
 * so label + input pairs remain visually consistent at every scale.
 *
 * Reference: apps/client/src/styles/forms/forms.constants.ts
 *   label.fontSize:   '0.9rem' ≈ sm
 *   label.fontWeight: 600 (semibold)
 *   label.color:      colors.textLight → fg.muted
 *
 * Usage:
 * ```tsx
 * import { labelRecipe } from '@workspace/design-system/recipes';
 *
 * <label className={labelRecipe({ size: 'md' })}>
 *   Email <span aria-hidden>*</span>
 * </label>
 * ```
 */
import { sva } from '../../styled-system/css';

export const labelRecipe = sva({
  className: 'label',
  // description: 'Form field label',

  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '1',
    fontWeight: 'semibold',
    color: 'fg.muted',
    userSelect: 'none',
    _disabled: {
      opacity: 0.55,
      cursor: 'not-allowed',
    },
  },

  variants: {
    size: {
      sm: { fontSize: 'xs', minH: '7' },
      md: { fontSize: 'sm', minH: '8' },
      lg: { fontSize: 'md', minH: '9' },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});
