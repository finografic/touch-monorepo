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
 *
 * NEW: Category-based transformations
 * - Different color categories (theme, status, grey, text) have distinct transformation rules
 * - Configured via simple contrast/chromaShift values in oklch-palette.config.ts
 */

import { COLOR_MAPPING } from '../colors/colors.source';
import type { ColorBaseName } from '../colors/colors.types';
import { OKLCH_PALETTE_CONFIG } from '../colors/oklch-palette.config';
import type { OKLCHTransformValues } from '../colors/oklch-palette.types';
import { getColorCategory } from '../colors/oklch-palette.types';
import { calculateTransformValues } from '../colors/oklch-palette.utils';
import type { ColorPalette } from '../colors/palette.types';
import type { EmotionTheme } from './emotion-theme.types';

/**
 * Parse OKLCH string to components
 * Example: 'oklch(68.8% 0.243 264.376)' → { l: 0.688, c: 0.243, h: 264.376 }
 */
function parseOKLCH(oklchString: string): { l: number; c: number; h: number } {
  const match = oklchString.match(/oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\)/);
  if (!match) throw new Error(`Invalid OKLCH string: ${oklchString}`);

  return {
    l: Number.parseFloat(match[1]) / 100, // Convert percentage to 0-1
    c: Number.parseFloat(match[2]),
    h: Number.parseFloat(match[3]),
  };
}

/**
 * Convert OKLCH to CSS oklch() string
 */
function toOKLCHString(l: number, c: number, h: number): string {
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)})`;
}

/**
 * Generate shade variants in OKLCH space using category-specific configuration
 *
 * This provides better perceptual uniformity than RGB manipulation,
 * and allows different transformation rules per color category.
 *
 * @param oklchString - Base OKLCH color string
 * @param colorName - Color name (to determine category)
 * @param mode - Light or dark theme mode
 * @returns Object with all shade variants
 */
function generateOKLCHShades(
  oklchString: string,
  colorName: ColorBaseName,
  mode: 'light' | 'dark',
): Record<string, string> {
  const { l, c, h } = parseOKLCH(oklchString);

  // Get category-specific transformation config
  const category = getColorCategory(colorName);
  const categoryConfig = OKLCH_PALETTE_CONFIG[mode][category];
  const transformValues = calculateTransformValues(categoryConfig, mode, category);

  const variants: Record<string, string> = {};
  const { lightnessSteps, chromaMultipliers, lightnessClamps } = transformValues;

  // Generate variants based on calculated transformation values
  if (mode === 'light') {
    // LIGHT THEME: base is darker, variants go lighter/darker
    variants.XXLight = toOKLCHString(
      Math.min(l + lightnessSteps.XXLight, lightnessClamps.max),
      c * chromaMultipliers.XXLight,
      h,
    );
    variants.XLight = toOKLCHString(
      Math.min(l + lightnessSteps.XLight, lightnessClamps.max),
      c * chromaMultipliers.XLight,
      h,
    );
    variants.Light = toOKLCHString(
      Math.min(l + lightnessSteps.Light, lightnessClamps.max),
      c * chromaMultipliers.Light,
      h,
    );
    variants.base = toOKLCHString(l, c * chromaMultipliers.base, h);
    variants.Dark = toOKLCHString(
      Math.max(l - lightnessSteps.Dark, lightnessClamps.min),
      c * chromaMultipliers.Dark,
      h,
    );
    variants.XDark = toOKLCHString(
      Math.max(l - lightnessSteps.XDark, lightnessClamps.min),
      c * chromaMultipliers.XDark,
      h,
    );
    variants.XXDark = toOKLCHString(
      Math.max(l - lightnessSteps.XXDark, lightnessClamps.min),
      c * chromaMultipliers.XXDark,
      h,
    );
  } else {
    // DARK THEME: base is lighter, variants go lighter/darker
    variants.XXLight = toOKLCHString(
      Math.min(l + lightnessSteps.XXLight, lightnessClamps.max),
      c * chromaMultipliers.XXLight,
      h,
    );
    variants.XLight = toOKLCHString(
      Math.min(l + lightnessSteps.XLight, lightnessClamps.max),
      c * chromaMultipliers.XLight,
      h,
    );
    variants.Light = toOKLCHString(
      Math.min(l + lightnessSteps.Light, lightnessClamps.max),
      c * chromaMultipliers.Light,
      h,
    );
    variants.base = toOKLCHString(l, c * chromaMultipliers.base, h);
    variants.Dark = toOKLCHString(
      Math.max(l - lightnessSteps.Dark, lightnessClamps.min),
      c * chromaMultipliers.Dark,
      h,
    );
    variants.XDark = toOKLCHString(
      Math.max(l - lightnessSteps.XDark, lightnessClamps.min),
      c * chromaMultipliers.XDark,
      h,
    );
    variants.XXDark = toOKLCHString(
      Math.max(l - lightnessSteps.XXDark, lightnessClamps.min),
      c * chromaMultipliers.XXDark,
      h,
    );
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
 * Now uses category-specific transformation rules for each color
 */
function generateOKLCHPalette(mode: 'light' | 'dark'): ColorPalette {
  const palette: any = {};

  // Process each color from the mapping
  Object.entries(COLOR_MAPPING).forEach(([colorName, { value }]) => {
    // Generate base color and shades using category-specific config
    const shades = generateOKLCHShades(value, colorName as ColorBaseName, mode);

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
