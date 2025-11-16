/**
 * Core design system constants
 * Base values derived from Tailwind, used as foundation for the design system
 * These are pure layout values that can be shared across different apps
 */

export const baseLayout = {
  padding: {
    none: '0',
    px: '1px',
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '0.75rem', // 12px
    default: '1rem', // 16px - DEFAULT (aligned with spacing)
    lg: '1.25rem', // 20px
    xl: '1.5rem', // 24px
    xxl: '1.75rem', // 28px
    xxxl: '2rem', // 32px
    xxxxl: '2.25rem', // 36px
  },
  spacing: {
    none: '0',
    px: '1px',
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '0.75rem', // 12px
    default: '1rem', // 16px - DEFAULT (most common)
    lg: '1.25rem', // 20px
    xl: '1.5rem', // 24px
    xxl: '1.75rem', // 28px
    xxxl: '2rem', // 32px
    xxxxl: '2.25rem', // 36px
  },
} as const;

export const border = {
  width: {
    none: '0',
    thin: '1px',
    default: '2px',
    thick: '4px',
  },
  radius: {
    none: '0',
    xs: '0.25rem',
    sm: '0.33rem',
    default: '0.5rem',
    lg: '0.66rem',
    xl: '1.00rem',
    xxl: '1.25rem',
    full: '50%',
  },
} as const;
