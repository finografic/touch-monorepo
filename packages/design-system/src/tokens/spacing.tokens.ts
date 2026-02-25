/**
 * 📐 Spacing, Border, and Shadow Tokens
 *
 * Mapped from existing client styles layout system.
 */

// ============================================================================
// SPACING SCALE
// ============================================================================

export const spacingTokens = {
  '0': { value: '0' },
  'px': { value: '1px' },
  '0.5': { value: '0.125rem' }, // 2px
  '1': { value: '0.25rem' }, // 4px (xs)
  '1.5': { value: '0.375rem' }, // 6px
  '2': { value: '0.5rem' }, // 8px (sm)
  '3': { value: '0.75rem' }, // 12px (md)
  '4': { value: '1rem' }, // 16px (default)
  '5': { value: '1.25rem' }, // 20px (lg)
  '6': { value: '1.5rem' }, // 24px (xl)
  '7': { value: '1.75rem' }, // 28px (xxl)
  '8': { value: '2rem' }, // 32px (xxxl)
  '9': { value: '2.25rem' }, // 36px (xxxxl)
  '10': { value: '2.5rem' }, // 40px
  '12': { value: '3rem' }, // 48px
  '16': { value: '4rem' }, // 64px
  '20': { value: '5rem' }, // 80px
  '24': { value: '6rem' }, // 96px
} as const;

// ============================================================================
// BORDER RADII
// ============================================================================

export const radiiTokens = {
  'none': { value: '0' },
  'xs': { value: '0.25rem' },
  'sm': { value: '0.33rem' },
  'md': { value: '0.5rem' },
  'lg': { value: '0.66rem' },
  'xl': { value: '1rem' },
  '2xl': { value: '1.25rem' },
  'full': { value: '9999px' },
} as const;

// ============================================================================
// BORDER WIDTHS
// ============================================================================

export const borderWidthTokens = {
  none: { value: '0' },
  light: { value: '1px' },
  default: { value: '2px' },
  heavy: { value: '4px' },
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadowTokens = {
  base: {
    sm: { value: '0 1px 2px 0 rgba(16, 24, 40, 0.05)' },
    md: { value: '0 4px 8px -2px rgba(16, 24, 40, 0.18), 0 1.5px 4px rgba(16, 24, 40, 0.14)' },
    lg: { value: '0 8px 24px rgba(16, 24, 40, 0.18), 0 1.5px 4px rgba(16, 24, 40, 0.08)' },
  },
} as const;

// ============================================================================
// Z-INDEX
// ============================================================================

export const zIndexTokens = {
  hide: { value: -1 },
  base: { value: 0 },
  docked: { value: 10 },
  dropdown: { value: 1000 },
  sticky: { value: 1100 },
  banner: { value: 1200 },
  overlay: { value: 1300 },
  modal: { value: 1400 },
  popover: { value: 1500 },
  toast: { value: 1700 },
  tooltip: { value: 1800 },
} as const;
