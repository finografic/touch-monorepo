/**
 * Badge Recipe
 *
 * Replaces Radix Themes <Badge> with a Panda CSS recipe.
 * Minimal, semantic, no wrapper elements needed.
 *
 * Usage:
 * ```tsx
 * <span className={badgeRecipe({ variant: 'soft', color: 'info' })}>
 *   3 columns × 4 rows
 * </span>
 * ```
 */
import { defineRecipe } from '@pandacss/dev';

export const badgeRecipe = defineRecipe({
  className: 'badge',
  description: 'Inline status indicator or label',

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
      sm: {
        fontSize: 'xs',
        paddingInline: '2',
        paddingBlock: '0.5',
        gap: '1',
      },
      md: {
        fontSize: 'sm',
        paddingInline: '3',
        paddingBlock: '1',
        gap: '1.5',
      },
      lg: {
        fontSize: 'md',
        paddingInline: '4',
        paddingBlock: '1.5',
        gap: '2',
      },
    },

    variant: {
      solid: {
        color: 'fg.inverted',
      },
      soft: {
        // background set by colorScheme compound variants
      },
      outline: {
        bg: 'transparent',
        borderWidth: 'light',
        borderStyle: 'solid',
      },
    },

    colorScheme: {
      primary: {},
      success: {},
      warning: {},
      danger: {},
      info: {},
      neutral: {},
    },
  },

  compoundVariants: [
    // Solid
    { variant: 'solid', colorScheme: 'primary', css: { bg: 'primary' } },
    { variant: 'solid', colorScheme: 'success', css: { bg: 'success' } },
    { variant: 'solid', colorScheme: 'warning', css: { bg: 'warning', color: 'fg' } },
    { variant: 'solid', colorScheme: 'danger', css: { bg: 'danger' } },
    { variant: 'solid', colorScheme: 'info', css: { bg: 'info' } },
    { variant: 'solid', colorScheme: 'neutral', css: { bg: 'neutral', color: 'fg.inverted' } },
    // Soft
    { variant: 'soft', colorScheme: 'primary', css: { bg: 'bg.info', color: 'fg.info' } },
    { variant: 'soft', colorScheme: 'success', css: { bg: 'bg.success', color: 'fg.success' } },
    { variant: 'soft', colorScheme: 'warning', css: { bg: 'bg.warning', color: 'fg.warning' } },
    { variant: 'soft', colorScheme: 'danger', css: { bg: 'bg.error', color: 'fg.error' } },
    { variant: 'soft', colorScheme: 'info', css: { bg: 'bg.info', color: 'fg.info' } },
    { variant: 'soft', colorScheme: 'neutral', css: { bg: 'bg.muted', color: 'fg.muted' } },
    // Outline
    { variant: 'outline', colorScheme: 'primary', css: { borderColor: 'accent.solid', color: 'accent.fg' } },
    { variant: 'outline', colorScheme: 'success', css: { borderColor: 'border.success', color: 'fg.success' } },
    { variant: 'outline', colorScheme: 'warning', css: { borderColor: 'border.warning', color: 'fg.warning' } },
    { variant: 'outline', colorScheme: 'danger', css: { borderColor: 'border.danger', color: 'fg.error' } },
    { variant: 'outline', colorScheme: 'info', css: { borderColor: 'border.info', color: 'fg.info' } },
    { variant: 'outline', colorScheme: 'neutral', css: { borderColor: 'border', color: 'fg.muted' } },
  ],

  defaultVariants: {
    size: 'md',
    variant: 'soft',
    colorScheme: 'neutral',
  },
});
