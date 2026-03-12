/**
 * Text Recipe
 *
 * Typography scale for headings, body text, captions, and overlines.
 * Sizes are tuned for application UI — not editorial/marketing scale.
 *
 * Reference: apps/client/src/styles/fonts/typography.contants.ts
 *
 *   V1 → V2 mapping
 *   h1 (xxxl 1.875rem) → 3xl
 *   h2 (xxl  1.5rem)   → 2xl
 *   h3 (xl   1.25rem)  → xl
 *   body (md 1rem)     → md
 *   caption (xs 0.75rem) → xs
 *
 * Usage:
 * ```tsx
 * import { textRecipe } from '@workspace/design-system/recipes';
 *
 * <h1 className={textRecipe({ variant: 'h1' })}>Page Title</h1>
 * <p  className={textRecipe({ variant: 'body', color: 'muted' })}>Subtitle</p>
 * ```
 */
import { sva } from '../../styled-system/css';

export const textRecipe = sva({
  className: 'text',
  // description: 'Typography scale — headings, body, caption, overline',

  base: {
    margin: '0',
  },

  variants: {
    // ── Variant ───────────────────────────────────────────────────────
    variant: {
      'h1': { fontSize: '3xl', fontWeight: 'bold', lineHeight: 'tight' },
      'h2': { fontSize: '2xl', fontWeight: 'bold', lineHeight: 'tight' },
      'h3': { fontSize: 'xl', fontWeight: 'semibold', lineHeight: 'snug' },
      'h4': { fontSize: 'lg', fontWeight: 'semibold', lineHeight: 'snug' },
      'h5': { fontSize: 'md', fontWeight: 'semibold', lineHeight: 'snug' },
      'h6': { fontSize: 'sm', fontWeight: 'semibold', lineHeight: 'snug' },

      'body-lg': { fontSize: 'lg', fontWeight: 'normal', lineHeight: 'normal' },
      'body': { fontSize: 'md', fontWeight: 'normal', lineHeight: 'normal' },
      'body-sm': { fontSize: 'sm', fontWeight: 'normal', lineHeight: 'normal' },

      'caption': {
        fontSize: 'xs',
        fontWeight: 'normal',
        lineHeight: 'normal',
      },
      'overline': {
        fontSize: 'xs',
        fontWeight: 'semibold',
        lineHeight: 'normal',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      },
    },

    // ── Color ─────────────────────────────────────────────────────────
    color: {
      default: { color: 'fg' },
      muted: { color: 'fg.muted' },
      subtle: { color: 'fg.subtle' },
      inverted: { color: 'fg.inverted' },
      error: { color: 'fg.error' },
      success: { color: 'fg.success' },
      warning: { color: 'fg.warning' },
      info: { color: 'fg.info' },
    },

    // ── Truncate ──────────────────────────────────────────────────────
    truncate: {
      true: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
  },

  defaultVariants: {
    variant: 'body',
    color: 'default',
  },
});
