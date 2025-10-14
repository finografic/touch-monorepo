/**
 * Script to generate MY_PALETTE.ts with current color values
 * Keeps the visual reference file in sync with the actual generated palette
 */

import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { COLOR_MAPPING } from '../colors.source';
import { lightColors } from '../../themes/light.colors';
import { SHADE_VARIANCE_FACTOR } from '../constants/js.constants';
import { SHADE_VARIANTS } from '../colors.types';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Simple hex color manipulation for generating shade variants
 * This replicates the original palette generation logic
 */
function generateShadeVariants(
  baseHex: string,
  varianceFactor: number = SHADE_VARIANCE_FACTOR,
): Record<string, string> {
  // Convert hex to RGB
  const hex = baseHex.replace('#', '');
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);

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
 * Generate actual hex values for all color variants using the theme files
 * This creates a proper visual reference with distinct shade values
 */
function generateActualHexValues(): Record<string, string> {
  const hexValues: Record<string, string> = {};

  // Use the actual hex values from the theme files instead of parsing OKLCH
  for (const [colorName, hexValue] of Object.entries(lightColors)) {
    // Skip transparency variants and fixed colors
    if (
      colorName.match(/\d+$/) ||
      colorName === 'white' ||
      colorName === 'black' ||
      colorName === 'transparent'
    ) {
      continue;
    }

    hexValues[colorName] = hexValue as string;
  }

  // Add fixed colors
  hexValues.white = '#ffffff';
  hexValues.black = '#000000';
  hexValues.transparent = 'transparent';
  hexValues.background = lightColors.background as string;

  return hexValues;
}

/**
 * Generate the MY_PALETTE.ts file content
 */
function generatePaletteContent(): string {
  const actualHexValues = generateActualHexValues();

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
  let content = `/**
 * Visual reference for the complete color palette
 * 🚨 AUTO-GENERATED - DO NOT EDIT MANUALLY
 * ${timestamp}
 *
 * Run: pnpm generate:palette to update this file
 *
 * This file shows the actual hex values for all color variants.
 * The main colors object uses CSS variables, but this provides
 * a visual reference of what those variables resolve to.
 */

export const ___COLORS___ = {\n`;

  // Sort entries in logical shade order (base, then lightest to darkest)
  const sortedEntries = Object.entries(actualHexValues)
    .filter(([key, _]) => !key.match(/\d+$/)) // Skip transparency variants
    .sort(([a], [b]) => {
      // Sort by base color name first
      const baseA = a.replace(/[A-Z][a-z]*|\d+/g, '');
      const baseB = b.replace(/[A-Z][a-z]*|\d+/g, '');
      if (baseA !== baseB) return baseA.localeCompare(baseB);

      /**
       * JS shade order for logical sorting (base first, then lightest to darkest)
       * Used for consistent ordering in generated palettes
       */

      // Then sort by shade order: base, XXLight, XLight, Light, Dark, XDark, XXDark
      const shadeOrder = ['', ...SHADE_VARIANTS];
      const shadeA = a.replace(baseA, '');
      const shadeB = b.replace(baseB, '');
      const orderA = shadeOrder.indexOf(shadeA as any);
      const orderB = shadeOrder.indexOf(shadeB as any);
      return orderA - orderB;
    });

  let lastBaseColor = '';
  for (const [key, hexValue] of sortedEntries) {
    // Get base color name (e.g., 'primary' from 'primaryLight')
    const baseColor = key.replace(/[A-Z][a-z]*|\d+/g, '');

    // Add line break between different base colors
    if (lastBaseColor && baseColor !== lastBaseColor) {
      content += '\n';
    }

    content += `  ${key}: '${hexValue}',\n`;
    lastBaseColor = baseColor;
  }

  content += '};\n\n';

  content += `/**
 * Color system statistics:
 * - Base colors: ${Object.keys(COLOR_MAPPING).length}
 * - Total variants: ${sortedEntries.length}
 * - Shade variants: ${sortedEntries.filter(([key]) => key !== key.toLowerCase()).length}
 * - Transparency variants: Generated mathematically (not shown here)
 */\n`;

  return content;
}

/**
 * Main function to generate and write the file
 */
function main() {
  try {
    const content = generatePaletteContent();
    const filePath = join(__dirname, '..', 'docs', 'MY_PALETTE.ts');

    writeFileSync(filePath, content, 'utf-8');

    console.log('✅ Generated MY_PALETTE.ts successfully!');
    console.log(`📄 File written to: ${filePath}`);
    console.log('🎨 Visual color reference updated with latest palette');
  } catch (error) {
    console.error('❌ Error generating MY_PALETTE.ts:', error);
    process.exit(1);
  }
}

// Run if this is the main module (ES module compatible)
main();

export { main as generateMyPalette };
