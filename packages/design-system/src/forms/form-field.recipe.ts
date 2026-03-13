/**
 * Form Field Recipe (Slot Recipe)
 *
 * Wrapper that composes label + control + helper/error text into a
 * consistent vertical stack. Uses Panda CSS `defineSlotRecipe` so each
 * part of the field is independently styled via generated class names.
 *
 * Slots:
 *   root             — outer flex column wrapper
 *   label            — the <label> element
 *   requiredIndicator — the '*' or '(required)' mark beside the label
 *   helperText       — secondary description below the control
 *   errorText        — validation error message
 *
 * Reference: apps/client/src/styles/forms/forms-validation.styles.ts
 *            apps/client/src/styles/forms/forms.constants.ts
 *
 * Usage:
 * ```tsx
 * import { formFieldRecipe } from '@workspace/design-system/recipes';
 *
 * const cls = formFieldRecipe({ size: 'md' });
 *
 * <div className={cls.root}>
 *   <label className={cls.label}>
 *     Name
 *     <span className={cls.requiredIndicator}>*</span>
 *   </label>
 *   <input className={inputRecipe({ size: 'md' })} />
 *   <span className={cls.helperText}>Used on your profile.</span>
 *   <span className={cls.errorText}>Name is required.</span>
 * </div>
 * ```
 */
import type { RecipeProps } from 'src/types/recipes.types';

import { sva } from '../../styled-system/css';

export const formFieldRecipe = sva({
  slots: ['root', 'label', 'requiredIndicator', 'helperText', 'errorText'],

  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5',
      width: '100%',
    },

    label: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '1',
      fontWeight: 'semibold',
      color: 'fg.muted',
      userSelect: 'none',
    },

    requiredIndicator: {
      color: 'fg.error',
      fontWeight: 'bold',
      lineHeight: '1',
    },

    helperText: {
      color: 'fg.subtle',
      lineHeight: 'normal',
    },

    errorText: {
      'display': 'flex',
      'alignItems': 'center',
      'gap': '1',
      'fontWeight': 'semibold',
      'color': 'fg.error',
      'lineHeight': 'normal',

      '& svg': {
        flexShrink: 0,
      },
    },
  },

  variants: {
    size: {
      sm: {
        root: { gap: '1' },
        label: { fontSize: 'xs' },
        helperText: { fontSize: 'xs' },
        errorText: { fontSize: 'xs' },
      },

      md: {
        label: { fontSize: 'sm' },
        helperText: { fontSize: 'xs' },
        errorText: { fontSize: 'sm' },
      },

      lg: {
        root: { gap: '2' },
        label: { fontSize: 'md' },
        helperText: { fontSize: 'sm' },
        errorText: { fontSize: 'sm' },
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

export type FormFieldRecipeProps = RecipeProps<typeof formFieldRecipe>;
