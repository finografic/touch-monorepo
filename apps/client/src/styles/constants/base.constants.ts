/**
 * Core design system constants
 * Base values derived from Tailwind, used as foundation for the design system
 * These are pure layout values that can be shared across different apps
 */

export const spacing = {
  0: '0',
  px: '1px',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
} as const;

export const baseLayout = {
  padding: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    default: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
  },
  borderWidth: {
    0: '0',
    default: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
  },
  borderRadius: {
    'none': '0',
    'sm': '0.125rem',
    'default': '0.25rem',
    'md': '0.375rem',
    'lg': '0.5rem',
    'xl': '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    'full': '9999px',
  },
} as const;
