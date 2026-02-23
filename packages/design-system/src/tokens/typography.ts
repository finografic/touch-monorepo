/**
 * 📝 Typography Tokens
 *
 * Mapped from the existing client styles typography system.
 * Font stacks, sizes, weights, and line heights.
 */

// ============================================================================
// FONT FAMILIES
// ============================================================================

export const fontTokens = {
  sans: {
    value: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      'ui-sans-serif',
      'system-ui',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Noto Color Emoji"',
    ].join(', '),
  },
  serif: {
    value: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },
  mono: {
    value:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
} as const;

// ============================================================================
// FONT SIZES
// ============================================================================

export const fontSizeTokens = {
  'xs': { value: '0.75rem' },
  'sm': { value: '0.875rem' },
  'md': { value: '1rem' },
  'lg': { value: '1.125rem' },
  'xl': { value: '1.25rem' },
  '2xl': { value: '1.5rem' },
  '3xl': { value: '1.875rem' },
  '4xl': { value: '2.25rem' },
  '5xl': { value: '3rem' },
  '6xl': { value: '3.75rem' },
} as const;

// ============================================================================
// FONT WEIGHTS
// ============================================================================

export const fontWeightTokens = {
  thin: { value: '100' },
  extralight: { value: '200' },
  light: { value: '300' },
  normal: { value: '400' },
  medium: { value: '500' },
  semibold: { value: '600' },
  bold: { value: '700' },
  extrabold: { value: '800' },
  black: { value: '900' },
} as const;

// ============================================================================
// LINE HEIGHTS
// ============================================================================

export const lineHeightTokens = {
  none: { value: '1' },
  tight: { value: '1.25' },
  snug: { value: '1.375' },
  normal: { value: '1.5' },
  relaxed: { value: '1.625' },
  loose: { value: '2' },
} as const;

// ============================================================================
// TEXT STYLES (composite token — Panda CSS textStyles)
// ============================================================================

export const textStyles = {
  h1: {
    value: {
      fontSize: '3.75rem',
      fontWeight: '700',
      lineHeight: '1.25',
    },
  },
  h2: {
    value: {
      fontSize: '3rem',
      fontWeight: '700',
      lineHeight: '1.25',
    },
  },
  h3: {
    value: {
      fontSize: '2.25rem',
      fontWeight: '600',
      lineHeight: '1.375',
    },
  },
  h4: {
    value: {
      fontSize: '1.875rem',
      fontWeight: '600',
      lineHeight: '1.375',
    },
  },
  h5: {
    value: {
      fontSize: '1.5rem',
      fontWeight: '600',
      lineHeight: '1.375',
    },
  },
  body: {
    lg: {
      value: {
        fontSize: '1.125rem',
        fontWeight: '400',
        lineHeight: '1.5',
      },
    },
    md: {
      value: {
        fontSize: '1rem',
        fontWeight: '400',
        lineHeight: '1.5',
      },
    },
    sm: {
      value: {
        fontSize: '0.875rem',
        fontWeight: '400',
        lineHeight: '1.5',
      },
    },
  },
  caption: {
    value: {
      fontSize: '0.75rem',
      fontWeight: '400',
      lineHeight: '1.5',
    },
  },
} as const;
