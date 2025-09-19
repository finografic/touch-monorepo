/**
 * Core design system constants
 * Base values derived from Tailwind, used as foundation for the design system
 * These are pure values that can be shared across different apps
 */

import { colors } from 'styles/colors/colors.styles';

export const baseLayout = {
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
  },
  padding: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
  },
  borderWidth: {
    0: '0',
    DEFAULT: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
  },
  borderRadius: {
    'none': '0',
    'sm': '0.125rem',
    'DEFAULT': '0.25rem',
    'md': '0.375rem',
    'lg': '0.5rem',
    'xl': '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    'full': '9999px',
  },
};

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
};

/**
 * Button and interactive element constants
 * Single source of truth for all button styling
 */
export const button = {
  border: {
    width: '2px',
    style: 'solid',
  },
  color: {
    default: colors.defaultDark,
    hover: colors.defaultXDark,
    active: colors.defaultXLight,
    disabled: colors.defaultDark,
  },
  md: {
    minWidth: '200px',
    minHeight: '60px',
  },
  radius: baseLayout.borderRadius.lg,
  transform: {
    hoverScale: 1.025,
    padHoverScale: 1.05,
    padBasicHoverScale: 1.02,
  },
  transition: 'transform 0.2s ease, border-color 0.2s ease, color 0.2s ease',
  disabled: {
    opacity: 0.55, // TODO: DEV VALUE (HIGH) FOR LIGHT MODE.. MAKE VALUE LIGHTER IF NEEDED
  },
  padding: {
    base: '1rem',
    small: '0.75rem',
    large: '1.25rem',
  },
  fontSize: {
    base: '1.5rem',
    small: '1.2rem',
    large: '1.8rem',
  },
  fontWeight: {
    base: '600',
    small: '600',
    large: '600',
  },
};
