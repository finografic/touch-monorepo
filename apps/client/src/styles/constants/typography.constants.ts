/**
 * Typography constants
 * Font families, sizes, weights, and smoothing
 */

export const typography = {
  fontFamily: {
    sans: [
      '-apple-system', // macOS system font (specific)
      'BlinkMacSystemFont', // macOS system font (specific)
      '"Segoe UI"', // Windows system font (specific)
      'Roboto', // Android/Chrome font (specific)
      '"Helvetica Neue"', // Fallback sans-serif (specific)
      'Arial', // Universal fallback (specific)
      'sans-serif', // Generic fallback (generic)
      'ui-sans-serif', // Generic system font (generic)
      'system-ui', // Generic system font (generic)
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Noto Color Emoji"',
    ],
    serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
    mono: [
      'ui-monospace',
      'SFMono-Regular',
      '"Menlo"',
      'Monaco',
      'Consolas',
      '"Liberation Mono"',
      '"Courier New"',
      'monospace',
    ],
  },
  fontSize: {
    'xs': '0.75rem',
    'sm': '0.875rem',
    'base': '1rem',
    'lg': '1.125rem',
    'xl': '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    'h1': '3.75rem',
  },
  /*
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    xxl: '1.5rem',
    xxxl: '1.875rem',
    h3: '2.25rem',
    h2: '3rem',
    h1: '3.75rem',
  },
  */
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  fontSmoothing: {
    'antialiased': {
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
    },
    'subpixel-antialiased': {
      '-webkit-font-smoothing': 'auto',
      '-moz-osx-font-smoothing': 'auto',
    },
  },
} as const;
