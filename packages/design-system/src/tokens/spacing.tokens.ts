/**
 * Spacing scale for Panda CSS. Used by margin, padding, gap.
 * Keys are referenced as strings in recipes and css() calls:
 *   px: '4', gap: '2', mt: '6'
 *
 * Values are in rem (1rem = 16px at default). Panda resolves at codegen.
 *
 * @example
 * // In recipe: px: '4' → padding-inline: var(--spacing-4) → 1rem (16px)
 * // In css():  gap: '2' → gap: var(--spacing-2) → 0.5rem (8px)
 */
import { defineTokens } from '@pandacss/dev';

export const spacingTokens = defineTokens.spacing({
  '0':   { value: '0'       },
  'px':  { value: '1px'     },
  '0.5': { value: '0.125rem' }, //  2px
  '1':   { value: '0.25rem'  }, //  4px
  '1.5': { value: '0.375rem' }, //  6px
  '2':   { value: '0.5rem'   }, //  8px
  '3':   { value: '0.75rem'  }, // 12px
  '4':   { value: '1rem'     }, // 16px
  '5':   { value: '1.25rem'  }, // 20px
  '6':   { value: '1.5rem'   }, // 24px
  '7':   { value: '1.75rem'  }, // 28px
  '8':   { value: '2rem'     }, // 32px
  '9':   { value: '2.25rem'  }, // 36px
  '10':  { value: '2.5rem'   }, // 40px
  '12':  { value: '3rem'     }, // 48px
  '16':  { value: '4rem'     }, // 64px
  '20':  { value: '5rem'     }, // 80px
  '24':  { value: '6rem'     }, // 96px
});

/**
 * Z-index scale for layered UI elements.
 * Keys are referenced as strings in recipes and css() calls:
 *   zIndex: 'modal', zIndex: 'tooltip'
 *
 * Values use a spaced numeric scale to allow insertion without
 * renumbering (e.g. a new layer between overlay and modal).
 *
 * @example
 * // In recipe: zIndex: 'tooltip' → z-index: 1800
 * // In css():  zIndex: 'overlay' → z-index: 1300
 */
export const zIndexTokens = defineTokens.zIndex({
  hide:     { value: -1   },
  base:     { value: 0    },
  docked:   { value: 10   },
  dropdown: { value: 1000 },
  sticky:   { value: 1100 },
  banner:   { value: 1200 },
  overlay:  { value: 1300 },
  modal:    { value: 1400 },
  popover:  { value: 1500 },
  toast:    { value: 1700 },
  tooltip:  { value: 1800 },
});
