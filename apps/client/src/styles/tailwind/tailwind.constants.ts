import type { ShadeKey } from '../colors.types';
import type { TWColorShade } from './tailwind.types';

// All possible Tailwind shade values
export const SHADES_TW: TWColorShade[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

// Mapping between our custom shade keys and Tailwind's numeric values
export const SHADES_CUSTOM_TO_TW: Record<ShadeKey, TWColorShade> = {
  xxlight: 100,
  xlight: 200,
  light: 300,
  base: 500,
  dark: 700,
  xdark: 900,
  xxdark: 950,
} as const;

export const SHADES_CUSTOM = Object.values(SHADES_CUSTOM_TO_TW);

// Generate the reverse mapping automatically
export const TW_SHADES_TO_CUSTOM = SHADES_TW.reduce(
  (acc, shade) => {
    // Find the custom key that maps to this shade value
    const customKey = Object.entries(SHADES_CUSTOM_TO_TW).find(([_, value]) => value === shade)?.[0] as
      | ShadeKey
      | undefined;
    return { ...acc, [shade]: customKey };
  },
  {} as Record<TWColorShade, ShadeKey | undefined>,
);

/**
 * Shade configurations for colors
 */
export const SHADES_CUSTOM_TW = {
  xxlight: { mix: { color: '#ffffff', amount: 0.78 }, saturate: 0.85 },
  xlight: { mix: { color: '#ffffff', amount: 0.66 }, saturate: 0.0 },
  light: { mix: { color: '#ffffff', amount: 0.4 }, saturate: 0.5 },
  base: {},
  dark: { mix: { color: '#000000', amount: 0.2 }, saturate: 0.1 },
  xdark: { mix: { color: '#000000', amount: 0.4 }, saturate: 0.15 },
  xxdark: { mix: { color: '#000000', amount: 0.6 }, saturate: 0.2 },
} as const;

// ======================================================================== //
// ======================================================================== //
// NOTE: OTHER TW values..

// (UNUSED) Tailwind v4 default spacing scale
export const twSpacing = {
  0: '0px',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem', // 16px
  5: '1.25rem',
  6: '1.5rem', // 24px
  7: '1.75rem',
  8: '2rem', // 32px
  9: '2.25rem',
  10: '2.5rem', // 40px
  11: '2.75rem',
  12: '3rem', // 48px
  14: '3.5rem',
  16: '4rem',
} as const;

// (UNUSED) Tailwind v4 default border widths
export const twBorders = {
  DEFAULT: '1px',
  0: '0px',
  2: '2px',
  4: '4px',
  8: '8px',
} as const;

// (UNUSED) Tailwind v4 default border radius
export const twRadius = {
  'none': '0px',
  'sm': '0.125rem',
  'DEFAULT': '0.25rem',
  'md': '0.375rem',
  'lg': '0.5rem',
  'xl': '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  'full': '9999px',
} as const;

// NOTE: USED!! Bridge object that maps your current layout values to Tailwind's
export const twLayout = {
  fontSize: 16, // Keep your base font size
  padding: twSpacing[4], // 1rem (16px)
  borderWidth: twBorders[2], // 2px
  borderRadius: twRadius.lg, // 0.5rem (8px)
  header: {
    height: '80px', // Keep your custom values
  },
  // ... rest of your custom layout values
} as const;

// NOTE: USED!! Tailwind v4 font families
export const twFontFamily = {
  sans: [
    'ui-sans-serif',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI Variable"',
    '"Segoe UI"',
    'Roboto',
    'Ubuntu',
    '"Noto Sans"',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    '"Noto Color Emoji"',
  ].join(', '),

  mono: [
    'ui-monospace',
    '"Roboto Mono"',
    '"Source Code Pro"',
    'Menlo',
    'Monaco',
    'Consolas',
    '"Courier New"',
    'monospace',
  ].join(', '),
} as const;

// NOTE: USED!! Tailwind v4 font weights
export const twFontWeight = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

// NOTE: USED!! Font rendering settings
export const twFontSmoothing = {
  antialiased: {
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    TextRendering: 'optimizeLegibility',
  },
  subpixel: {
    WebkitFontSmoothing: 'auto',
    MozOsxFontSmoothing: 'auto',
    TextRendering: 'auto',
  },
} as const;
