/**
 * Badge Recipe
 *
 * Variants: size (sm | md | lg) · variant (solid | soft | outline) · palette
 */
import { cva } from '@styled-system/css';

export const badgeRecipe = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    fontWeight: 'semibold',
    borderRadius: 'sm',
    whiteSpace: 'nowrap',
    lineHeight: '1',
  },

  variants: {
    size: {
      sm: { fontSize: 'xs', paddingInline: '2', paddingBlock: '0.5', gap: '1' },
      md: { fontSize: 'sm', paddingInline: '3', paddingBlock: '1', gap: '1.5' },
      lg: { fontSize: 'md', paddingInline: '4', paddingBlock: '1.5', gap: '2' },
    },

    variant: {
      solid: { color: 'fg.inverted' },
      soft: {},
      outline: { bg: 'transparent', borderWidth: 'light', borderStyle: 'solid' },
    },

    palette: {
      primary: {},
      success: {},
      warning: {},
      danger: {},
      info: {},
      neutral: {},
    },
  },

  compoundVariants: [
    { variant: 'solid', palette: 'primary', css: { bg: 'primary' } },
    { variant: 'solid', palette: 'success', css: { bg: 'success' } },
    { variant: 'solid', palette: 'warning', css: { bg: 'warning', color: 'fg' } },
    { variant: 'solid', palette: 'danger', css: { bg: 'danger' } },
    { variant: 'solid', palette: 'info', css: { bg: 'info' } },
    { variant: 'solid', palette: 'neutral', css: { bg: 'neutral', color: 'fg.inverted' } },

    { variant: 'soft', palette: 'primary', css: { bg: 'accent.subtle', color: 'accent.fg' } },
    { variant: 'soft', palette: 'success', css: { bg: 'bg.success', color: 'fg.success' } },
    { variant: 'soft', palette: 'warning', css: { bg: 'bg.warning', color: 'fg.warning' } },
    { variant: 'soft', palette: 'danger', css: { bg: 'bg.error', color: 'fg.error' } },
    { variant: 'soft', palette: 'info', css: { bg: 'bg.info', color: 'fg.info' } },
    { variant: 'soft', palette: 'neutral', css: { bg: 'bg.muted', color: 'fg.muted' } },

    { variant: 'outline', palette: 'primary', css: { borderColor: 'accent.solid', color: 'accent.fg' } },
    { variant: 'outline', palette: 'success', css: { borderColor: 'border.success', color: 'fg.success' } },
    { variant: 'outline', palette: 'warning', css: { borderColor: 'border.warning', color: 'fg.warning' } },
    { variant: 'outline', palette: 'danger', css: { borderColor: 'border.error', color: 'fg.error' } },
    { variant: 'outline', palette: 'info', css: { borderColor: 'border.info', color: 'fg.info' } },
    { variant: 'outline', palette: 'neutral', css: { borderColor: 'border', color: 'fg.muted' } },
  ],

  defaultVariants: {
    size: 'md',
    variant: 'soft',
    palette: 'neutral',
  },
});
