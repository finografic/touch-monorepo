/**
 * FieldBox Recipe
 *
 * Slots:    root · label · requiredIndicator · helperText · errorText · warningText
 * Variants: size (sm | md | lg)
 */
import { sva } from '@styled-system/css';

export const fieldBoxRecipe = sva({
  className: 'field-box',

  slots: ['root', 'label', 'requiredIndicator', 'helperText', 'errorText', 'warningText'],

  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
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
      display: 'flex',
      alignItems: 'center',
      gap: '1',
      fontWeight: 'semibold',
      color: 'fg.error',
      lineHeight: 'normal',
    },

    warningText: {
      display: 'flex',
      alignItems: 'center',
      gap: '1',
      fontWeight: 'semibold',
      color: 'fg.warning',
      lineHeight: 'normal',
    },
  },

  variants: {
    size: {
      sm: {
        root: { gap: '1' },
        label: { fontSize: 'xs' },
        helperText: { fontSize: 'xs' },
        errorText: { fontSize: 'xs' },
        warningText: { fontSize: 'xs' },
      },
      md: {
        root: { gap: '1.5' },
        label: { fontSize: 'sm' },
        helperText: { fontSize: 'xs' },
        errorText: { fontSize: 'sm' },
        warningText: { fontSize: 'sm' },
      },
      lg: {
        root: { gap: '2' },
        label: { fontSize: 'md' },
        helperText: { fontSize: 'sm' },
        errorText: { fontSize: 'sm' },
        warningText: { fontSize: 'sm' },
      },
    },
  },

  defaultVariants: { size: 'md' },
});
