/**
 * Theme Generator - Auto-generates light.colors.ts and dark.colors.ts
 *
 * This script generates theme-specific color files from predefined theme colors,
 * ensuring consistency and eliminating manual maintenance.
 */

import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import {
  SATURATION_FACTOR,
  SHADE_VARIANCE_FACTOR,
  STATUS_SATURATION_FACTOR,
} from '../constants/js.constants';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generate shade variants for a base color
 * Uses the same logic as generateMyPalette.util.ts
 */
function generateShadeVariants(
  baseHex: string,
  colorName: string,
  varianceFactor: number = SHADE_VARIANCE_FACTOR,
): Record<string, string> {
  // Use STATUS_SATURATION_FACTOR for status colors
  const isStatusColor = ['success', 'warning', 'danger', 'info'].includes(colorName);
  const baseSaturation = isStatusColor ? STATUS_SATURATION_FACTOR : SATURATION_FACTOR;
  // Convert hex to RGB
  const hex = baseHex.replace('#', '');
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);

  const variants: Record<string, string> = {};

  // Generate shade variants with proper semantics and configurable variance/saturation

  /*
  const shades = [
    // Lighter variants - maintain more chroma for OKLCH's clean variations
    { name: 'XXLight', lighten: 0.8 * varianceFactor, saturate: baseSaturation * 0.85 }, // Much lighter, preserve chroma
    { name: 'XLight', lighten: 0.6 * varianceFactor, saturate: baseSaturation * 0.9 }, // Lighter, clean saturation
    { name: 'Light', lighten: 0.4 * varianceFactor, saturate: baseSaturation * 0.95 }, // Slightly lighter, minimal desaturation
    // Darker variants - leverage OKLCH's better saturation handling
    { name: 'Dark', lighten: -0.4 * varianceFactor, saturate: baseSaturation * 1.2 }, // Slightly darker, more vibrant
    { name: 'XDark', lighten: -0.6 * varianceFactor, saturate: baseSaturation * 1.3 }, // Darker, rich saturation
    { name: 'XXDark', lighten: -0.8 * varianceFactor, saturate: baseSaturation * 1.4 }, // Much darker, maximum vibrancy
  ];
  */

  const shades = [
    // Lighter variants - maintain more chroma for OKLCH's clean variations
    { name: 'XXLight', lighten: 0.8 * varianceFactor, saturate: baseSaturation * 0.85 }, // Much lighter, preserve chroma
    { name: 'XLight', lighten: 0.6 * varianceFactor, saturate: baseSaturation * 0.9 }, // Lighter, clean saturation
    { name: 'Light', lighten: 0.4 * varianceFactor, saturate: baseSaturation * 0.95 }, // Slightly lighter, minimal desaturation
    // Darker variants - leverage OKLCH's better saturation handling
    { name: 'Dark', lighten: -0.5 * varianceFactor, saturate: baseSaturation * 1.4 }, // Slightly darker, more vibrant
    { name: 'XDark', lighten: -0.66 * varianceFactor, saturate: baseSaturation * 1.5 }, // Darker, rich saturation
    { name: 'XXDark', lighten: -0.8 * varianceFactor, saturate: baseSaturation * 1.6 }, // Much darker, maximum vibrancy
  ];

  shades.forEach(({ name, lighten, saturate }) => {
    let newR, newG, newB;

    // Calculate luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Calculate color saturation
    const maxColor = Math.max(r, g, b);
    const minColor = Math.min(r, g, b);
    const saturation = maxColor === 0 ? 0 : (maxColor - minColor) / maxColor;

    if (lighten > 0) {
      // Lighten: move towards white with saturation control
      newR = Math.round(r + (255 - r) * lighten);
      newG = Math.round(g + (255 - g) * lighten);
      newB = Math.round(b + (255 - b) * lighten);
    } else {
      // Darken: move towards black with saturation control
      newR = Math.round(r * (1 + lighten));
      newG = Math.round(g * (1 + lighten));
      newB = Math.round(b * (1 + lighten));
    }

    // Apply saturation adjustment
    const avgColor = (newR + newG + newB) / 3;
    newR = Math.round(avgColor + (newR - avgColor) * saturate);
    newG = Math.round(avgColor + (newG - avgColor) * saturate);
    newB = Math.round(avgColor + (newB - avgColor) * saturate);

    // Clamp values to valid RGB range
    newR = Math.max(0, Math.min(255, newR));
    newG = Math.max(0, Math.min(255, newG));
    newB = Math.max(0, Math.min(255, newB));

    variants[name] =
      `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  });

  return variants;
}

/**
 * Theme-specific color adjustments
 * These define how colors should be modified for each theme
 */
// Light theme colors
const LIGHT_COLORS = {
  primary: '#1e3a8a', // Blue-900
  secondary: '#7e22ce', // Purple-700
  success: '#065f46', // Green-800
  warning: '#92400e', // Amber-800
  danger: '#991b1b', // Red-800
  info: '#1e40af', // Blue-800
  text: '#000000', // Pure black
  grey: '#1f2937', // Grey-800
  default: '#111827', // Grey-900
  background: '#fefefe', // Pure white with subtle warmth
} as const;

// Dark theme colors
const DARK_COLORS = {
  primary: '#93c5fd', // Blue-300
  secondary: '#e879f9', // Purple-300
  success: '#6ee7b7', // Green-300
  warning: '#fcd34d', // Amber-300
  danger: '#fca5a5', // Red-300
  info: '#93c5fd', // Blue-300
  text: '#ffffff', // Pure white
  grey: '#d1d5db', // Grey-300
  default: '#d1d5db', // Grey-300
  background: '#0f172a', // Darker slate background
} as const;

const THEME_ADJUSTMENTS = {
  light: LIGHT_COLORS,
  dark: DARK_COLORS,
} as const;

/**
 * Generate theme file content
 */
function generateThemeContent(themeName: 'light' | 'dark'): string {
  const themeColors = THEME_ADJUSTMENTS[themeName];
  const themeTitle = themeName.charAt(0).toUpperCase() + themeName.slice(1);

  const now = new Date();
  const timestamp = `📅 Generated: ${now
    .toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, '$3-$1-$2 -- $4:$5:$6')}`;
  let content = `import type { ColorPalette } from 'styles/colors/palette.types';

/**
 * ${themeTitle} theme color palette - actual hex values for CSS variable generation
 * 🚨 AUTO-GENERATED - DO NOT EDIT MANUALLY
 * ${timestamp}
 *
 * Run: pnpm generate:themes to update this file
 *
 * These colors are used to generate the CSS variables that the main colors object references
 */
export const ${themeName}Colors: ColorPalette = {
`;

  // Define color order (matches OKLCH generator)
  const colorOrder = [
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'info',
    'text',
    'grey',
    'default',
  ];

  // Generate each color group with spacing
  for (const colorName of colorOrder) {
    const baseHex = themeColors[colorName as keyof typeof themeColors];
    if (!baseHex) continue;

    // Generate shade variants
    const variants = generateShadeVariants(baseHex, colorName);

    // Add lighter shades first (lightest to light)
    content += `  ${colorName}XXLight: '${variants.XXLight}',\n`;
    content += `  ${colorName}XLight: '${variants.XLight}',\n`;
    content += `  ${colorName}Light: '${variants.Light}',\n`;

    // Add base color in the middle (creates visual gradient)
    content += `  ${colorName}: '${baseHex}',\n`;

    // Add darker shades (dark to darkest)
    content += `  ${colorName}Dark: '${variants.Dark}',\n`;
    content += `  ${colorName}XDark: '${variants.XDark}',\n`;
    content += `  ${colorName}XXDark: '${variants.XXDark}',\n`;

    // Add blank line after each color group
    content += '\n';
  }

  // Add fixed colors at the end
  content += `  background: '${themeColors.background}',\n`;
  content += "  transparent: 'transparent',\n\n";
  content += '  // Fixed colors\n';
  content += "  white: '#ffffff',\n";
  content += "  black: '#000000',\n";
  content += `} as any; // Cast to avoid complex type checking for now
`;

  return content;
}

/**
 * Main function to generate theme files
 */
function main() {
  try {
    const themesDir = join(__dirname, '../..', 'themes');

    // Generate light theme (old RGB-based hex file)
    const lightContent = generateThemeContent('light');
    const lightPath = join(themesDir, 'light.colors.hex.ts');
    writeFileSync(lightPath, lightContent, 'utf-8');

    // Generate dark theme (old RGB-based hex file)
    const darkContent = generateThemeContent('dark');
    const darkPath = join(themesDir, 'dark.colors.hex.ts');
    writeFileSync(darkPath, darkContent, 'utf-8');

    console.log('✅ Generated theme files successfully!');
    console.log(`📄 Light theme: ${lightPath}`);
    console.log(`📄 Dark theme: ${darkPath}`);
    console.log('🎨 Theme files updated with latest palette');
  } catch (error) {
    console.error('❌ Error generating theme files:', error);
    process.exit(1);
  }
}

// Run if this is the main module (ES module compatible)
main();

export { main as generateThemes };
