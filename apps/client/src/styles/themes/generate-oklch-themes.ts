/**
 * OKLCH-Based Theme Generation
 *
 * Maintains OKLCH color space for better perceptual uniformity
 * and smoother color transitions between shades.
 *
 * Benefits of OKLCH:
 * - Perceptually uniform (equal distance = equal perceived difference)
 * - Wider color gamut than sRGB
 * - Better for generating shade variants
 * - Smoother gradients
 */

import type { ColorPalette } from '../colors/palette.types';
import type { EmotionTheme } from './emotion-theme.types';
import { COLOR_MAPPING } from '../colors/colors.source';

/**
 * Parse OKLCH string to components
 * Example: 'oklch(68.8% 0.243 264.376)' → { l: 0.688, c: 0.243, h: 264.376 }
 */
function parseOKLCH(oklchString: string): { l: number; c: number; h: number } {
  const match = oklchString.match(/oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\)/);
  if (!match) throw new Error(`Invalid OKLCH string: ${oklchString}`);

  return {
    l: parseFloat(match[1]) / 100, // Convert percentage to 0-1
    c: parseFloat(match[2]),
    h: parseFloat(match[3]),
  };
}

/**
 * Convert OKLCH to CSS oklch() string
 */
function toOKLCHString(l: number, c: number, h: number): string {
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)})`;
}

/**
 * Generate shade variants in OKLCH space
 * This provides better perceptual uniformity than RGB manipulation
 */
function generateOKLCHShades(
  oklchString: string,
  mode: 'light' | 'dark'
): Record<string, string> {
  const { l, c, h } = parseOKLCH(oklchString);

  const variants: Record<string, string> = {};

  // Light theme: base is darker, variants go lighter
  // Dark theme: base is lighter, variants go lighter
  const isLightTheme = mode === 'light';

  if (isLightTheme) {
    // Light theme: darker base, lighter variants
    variants.base = toOKLCHString(l, c, h);
    variants.XXLight = toOKLCHString(Math.min(l + 0.25, 0.95), c * 0.7, h);
    variants.XLight = toOKLCHString(Math.min(l + 0.18, 0.90), c * 0.75, h);
    variants.Light = toOKLCHString(Math.min(l + 0.12, 0.85), c * 0.85, h);
    variants.Dark = toOKLCHString(Math.max(l - 0.12, 0.15), c * 1.1, h);
    variants.XDark = toOKLCHString(Math.max(l - 0.18, 0.10), c * 1.15, h);
    variants.XXDark = toOKLCHString(Math.max(l - 0.25, 0.05), c * 1.2, h);
  } else {
    // Dark theme: lighter base, even lighter variants
    variants.base = toOKLCHString(l, c, h);
    variants.XXLight = toOKLCHString(Math.min(l + 0.15, 0.98), c * 0.6, h);
    variants.XLight = toOKLCHString(Math.min(l + 0.10, 0.95), c * 0.7, h);
    variants.Light = toOKLCHString(Math.min(l + 0.06, 0.90), c * 0.8, h);
    variants.Dark = toOKLCHString(Math.max(l - 0.15, 0.30), c * 1.1, h);
    variants.XDark = toOKLCHString(Math.max(l - 0.22, 0.20), c * 1.15, h);
    variants.XXDark = toOKLCHString(Math.max(l - 0.30, 0.15), c * 1.2, h);
  }

  return variants;
}

/**
 * Generate transparency variants in OKLCH space
 * Using OKLCH alpha instead of rgba
 */
function generateOKLCHTransparency(oklchString: string): Record<string, string> {
  const { l, c, h } = parseOKLCH(oklchString);

  return {
    '25': `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)} / 0.25)`,
    '50': `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)} / 0.5)`,
    '75': `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)} / 0.75)`,
  };
}

/**
 * Generate complete OKLCH-based color palette
 */
function generateOKLCHPalette(mode: 'light' | 'dark'): ColorPalette {
  const palette: any = {};

  // Process each color from the mapping
  Object.entries(COLOR_MAPPING).forEach(([colorName, { value }]) => {
    // Generate base color and shades
    const shades = generateOKLCHShades(value, mode);

    palette[colorName] = shades.base;
    palette[`${colorName}XXLight`] = shades.XXLight;
    palette[`${colorName}XLight`] = shades.XLight;
    palette[`${colorName}Light`] = shades.Light;
    palette[`${colorName}Dark`] = shades.Dark;
    palette[`${colorName}XDark`] = shades.XDark;
    palette[`${colorName}XXDark`] = shades.XXDark;

    // Generate transparency variants for base
    const transparency = generateOKLCHTransparency(shades.base);
    palette[`${colorName}25`] = transparency['25'];
    palette[`${colorName}50`] = transparency['50'];
    palette[`${colorName}75`] = transparency['75'];

    // Generate transparency variants for each shade
    ['XXLight', 'XLight', 'Light', 'Dark', 'XDark', 'XXDark'].forEach((shade) => {
      const trans = generateOKLCHTransparency(shades[shade]);
      palette[`${colorName}${shade}25`] = trans['25'];
      palette[`${colorName}${shade}50`] = trans['50'];
      palette[`${colorName}${shade}75`] = trans['75'];
    });
  });

  // Add fixed colors
  palette.background = mode === 'light' ? '#fefefe' : '#0f172a';
  palette.transparent = 'transparent';
  palette.white = '#ffffff';
  palette.black = '#000000';

  // Add transparency variants for white and black
  palette.white25 = 'rgba(255, 255, 255, 0.25)';
  palette.white50 = 'rgba(255, 255, 255, 0.5)';
  palette.white75 = 'rgba(255, 255, 255, 0.75)';
  palette.black25 = 'rgba(0, 0, 0, 0.25)';
  palette.black50 = 'rgba(0, 0, 0, 0.5)';
  palette.black75 = 'rgba(0, 0, 0, 0.75)';

  return palette;
}

/**
 * OKLCH Light Theme
 */
export const oklchLightTheme: EmotionTheme = {
  name: 'light',
  colors: generateOKLCHPalette('light'),
};

/**
 * OKLCH Dark Theme
 */
export const oklchDarkTheme: EmotionTheme = {
  name: 'dark',
  colors: generateOKLCHPalette('dark'),
};

/**
 * OKLCH Theme map
 */
export const oklchThemes = {
  light: oklchLightTheme,
  dark: oklchDarkTheme,
} as const;

