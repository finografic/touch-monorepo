/**
 * Sizes token scale for Panda CSS.
 *
 * Used by width, height, min-width, max-width, min-height, max-height.
 * Keys are referenced as strings in recipes and css() calls:
 *   width: '9', height: '5', maxWidth: 'sidebar'
 *
 * Includes:
 *   - Numeric scale (rem-based, mirrors spacing scale)
 *   - Named layout sizes (structural app dimensions)
 *
 * @example
 * // In recipe: width: '9'   → var(--sizes-9)   → 2.25rem (36px)
 * // In recipe: h: 'navbar'  → var(--sizes-navbar) → 41px
 * // In css():  maxWidth: 'content' → var(--sizes-content) → 1200px
 */
import { defineTokens } from '@pandacss/dev';

export const sizingTokens = defineTokens.sizes({
  // ── Numeric scale (rem) ─────────────────────────────────────────────────
  '0':    { value: '0' },
  'px':   { value: '1px' },
  '0.5':  { value: '0.125rem' }, //   2px
  '1':    { value: '0.25rem'  }, //   4px
  '1.5':  { value: '0.375rem' }, //   6px
  '2':    { value: '0.5rem'   }, //   8px
  '3':    { value: '0.75rem'  }, //  12px
  '4':    { value: '1rem'     }, //  16px
  '5':    { value: '1.25rem'  }, //  20px
  '6':    { value: '1.5rem'   }, //  24px
  '7':    { value: '1.75rem'  }, //  28px
  '8':    { value: '2rem'     }, //  32px
  '9':    { value: '2.25rem'  }, //  36px
  '10':   { value: '2.5rem'   }, //  40px
  '12':   { value: '3rem'     }, //  48px
  '16':   { value: '4rem'     }, //  64px
  '20':   { value: '5rem'     }, //  80px
  '24':   { value: '6rem'     }, //  96px

  // ── Named layout sizes ───────────────────────────────────────────────────
  // Override at the app level with CSS vars (see layout.tokens.ts).
  'navbar':   { value: '41px'   },
  'header':   { value: '70px'   },
  'footer':   { value: '70px'   },
  'sidebar':  { value: '300px'  },
  'content':  { value: '1200px' },
});
