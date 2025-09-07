/**
 * Theme Generator - Auto-generates light.colors.ts and dark.colors.ts
 *
 * This script generates theme-specific color files from the base COLOR_MAPPING,
 * ensuring consistency and eliminating manual maintenance.
 */

import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { COLOR_MAPPING } from '../custom/custom.colors';
import { SHADE_VARIANCE_FACTOR, JS_SHADE_VARIANTS } from '../js.constants';
import { CSS_BASE_COLORS } from '../css.constants';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generate shade variants for a base color
 * Uses the same logic as generateMyPalette.util.ts
 */
function generateShadeVariants(
  baseHex: string,
  varianceFactor: number = SHADE_VARIANCE_FACTOR,
): Record<string, string> {
  // Convert hex to RGB
  const hex = baseHex.replace('#', '');
  const r = Number.parseInt(hex.substr(0, 2), 16);
  const g = Number.parseInt(hex.substr(2, 2), 16);
  const b = Number.parseInt(hex.substr(4, 2), 16);

  const variants: Record<string, string> = {};

  // Generate shade variants with proper semantics and configurable variance
  const shades = [
    { name: 'XXLight', lighten: 0.8 * varianceFactor }, // Much lighter
    { name: 'XLight', lighten: 0.6 * varianceFactor }, // Lighter
    { name: 'Light', lighten: 0.4 * varianceFactor }, // Slightly lighter
    { name: 'Dark', lighten: -0.4 * varianceFactor }, // Slightly darker
    { name: 'XDark', lighten: -0.6 * varianceFactor }, // Darker
    { name: 'XXDark', lighten: -0.8 * varianceFactor }, // Much darker
  ];

  shades.forEach(({ name, lighten }) => {
    let newR, newG, newB;

    if (lighten > 0) {
      // Lighten: move towards white
      newR = Math.round(r + (255 - r) * lighten);
      newG = Math.round(g + (255 - g) * lighten);
      newB = Math.round(b + (255 - b) * lighten);
    } else {
      // Darken: move towards black
      newR = Math.round(r * (1 + lighten));
      newG = Math.round(g * (1 + lighten));
      newB = Math.round(b * (1 + lighten));
    }

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
const THEME_ADJUSTMENTS = {
  light: {
    // Light theme: darker colors for high contrast on light backgrounds
    primary: '#1e3a8a', // Blue-900
    secondary: '#047857', // Emerald-700
    success: '#065f46', // Emerald-800
    warning: '#92400e', // Amber-800
    danger: '#991b1b', // Red-800
    info: '#1e40af', // Blue-800
    text: '#000000', // Pure black
    grey: '#1f2937', // Gray-800
    gray: '#1f2937', // Gray-800
    default: '#111827', // Gray-900
    background: '#fefefe', // Pure white with subtle warmth
  },
  dark: {
    // Dark theme: lighter colors for visibility on dark backgrounds
    primary: '#93c5fd', // Blue-300
    secondary: '#6ee7b7', // Emerald-300
    success: '#6ee7b7', // Emerald-300
    warning: '#fcd34d', // Amber-300
    danger: '#fca5a5', // Red-300
    info: '#93c5fd', // Blue-300
    text: '#ffffff', // Pure white
    grey: '#d1d5db', // Gray-300
    gray: '#d1d5db', // Gray-300
    default: '#d1d5db', // Gray-300
    background: '#0f172a', // Darker slate background
  },
} as const;

/**
 * Generate theme file content
 */
function generateThemeContent(themeName: 'light' | 'dark'): string {
  const themeColors = THEME_ADJUSTMENTS[themeName];
  const themeTitle = themeName.charAt(0).toUpperCase() + themeName.slice(1);

  let content = `import type { ColorPalette } from '../palette.types';

/**
 * ${themeTitle} theme color palette - actual hex values for CSS variable generation
 * 🚨 AUTO-GENERATED - DO NOT EDIT MANUALLY
 *
 * Run: pnpm generate:themes to update this file
 *
 * These colors are used to generate the CSS variables that the main colors object references
 */
export const ${themeName}Colors: ColorPalette = {
`;

  // Generate colors for each base color
  for (const [colorName, baseHex] of Object.entries(themeColors)) {
    // Skip generating variants for fixed colors
    if (colorName === 'white' || colorName === 'black' || colorName === 'transparent') {
      content += `  ${colorName}: '${baseHex}',\n`;
      continue;
    }

    // Add base color
    content += `  ${colorName}: '${baseHex}',\n`;

    // Generate and add shade variants
    const variants = generateShadeVariants(baseHex);
    Object.entries(variants).forEach(([variantName, hexValue]) => {
      content += `  ${colorName}${variantName}: '${hexValue}',\n`;
    });

    // Add spacing between color groups
    content += '\n';
  }

  // Add fixed colors
  content += `  transparent: 'transparent',

  // Fixed colors
  white: '#ffffff',
  black: '#000000',
  background: '${themeColors.background}',
} as any; // Cast to avoid complex type checking for now
`;

  return content;
}

/**
 * Main function to generate theme files
 */
function main() {
  try {
    const themesDir = join(__dirname, '..', 'themes');

    // Generate light theme
    const lightContent = generateThemeContent('light');
    const lightPath = join(themesDir, 'light.colors.ts');
    writeFileSync(lightPath, lightContent, 'utf-8');

    // Generate dark theme
    const darkContent = generateThemeContent('dark');
    const darkPath = join(themesDir, 'dark.colors.ts');
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
