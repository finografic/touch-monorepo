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

export const borderWidthTokens = {
  none: { value: '0' },
  light: { value: '1px' },
  default: { value: '2px' },
  heavy: { value: '4px' },
} as const;

export const shadowTokens = {
  base: {
    sm: { value: '0 1px 2px 0 rgba(16, 24, 40, 0.05)' },
    md: { value: '0 4px 8px -2px rgba(16, 24, 40, 0.18), 0 1.5px 4px rgba(16, 24, 40, 0.14)' },
    lg: { value: '0 8px 24px rgba(16, 24, 40, 0.18), 0 1.5px 4px rgba(16, 24, 40, 0.08)' },
  },
} as const;
