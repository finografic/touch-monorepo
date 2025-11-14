/**
 * Generate Emotion themes with transparency variants
 * Creates complete theme objects with direct hex/rgba values (no CSS variables!)
 */

import type { HexColor } from '../colors/colors.types';
import type { ColorPalette } from '../colors/palette.types';
import { darkColors } from './dark.colors';
import type { EmotionTheme } from './emotion-theme.types';
import { lightColors } from './light.colors';

/**
 * Convert hex color to rgba with alpha
 */
function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace('#', '');
  const r = Number.parseInt(cleanHex.substring(0, 2), 16);
  const g = Number.parseInt(cleanHex.substring(2, 4), 16);
  const b = Number.parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Generate transparency variants for all colors
 */
function generateTransparencyVariants(baseColors: ColorPalette): ColorPalette {
  const enhanced: any = { ...baseColors };

  // Transparency levels
  const levels = [25, 50, 75];

  // Process each color in the palette
  Object.entries(baseColors).forEach(([key, value]) => {
    if (typeof value === 'string' && value.startsWith('#')) {
      // Add transparency variants for this color
      levels.forEach((level) => {
        const alpha = level / 100;
        enhanced[`${key}${level}`] = hexToRgba(value, alpha);
      });
    }
  });

  return enhanced;
}

/**
 * Create light theme with all variants
 */
export const lightTheme: EmotionTheme = {
  name: 'light',
  colors: generateTransparencyVariants(lightColors),
};

/**
 * Create dark theme with all variants
 */
export const darkTheme: EmotionTheme = {
  name: 'dark',
  colors: generateTransparencyVariants(darkColors),
};

/**
 * Theme map for easy access
 */
export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;
