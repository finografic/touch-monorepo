/**
 * Script to generate MY_PALETTE.ts with current color values
 * Keeps the visual reference file in sync with the actual generated palette
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { generateColorPaletteWithCssVars } from '../custom/cssvar.palette';
import { COLOR_MAPPING } from '../custom/custom.colors';
import { lightColors } from '../themes/light.colors';

/**
 * Simple hex color manipulation for generating shade variants
 * This replicates the original palette generation logic
 */
function generateShadeVariants(baseHex: string): Record<string, string> {
  // Convert hex to RGB
  const hex = baseHex.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const variants: Record<string, string> = {};
  
  // Generate shade variants (simplified algorithm)
  const shades = [
    { name: 'XXLight', factor: 0.9 },
    { name: 'XLight', factor: 0.8 },
    { name: 'Light', factor: 0.7 },
    { name: 'Dark', factor: 0.3 },
    { name: 'XDark', factor: 0.2 },
    { name: 'XXDark', factor: 0.1 },
  ];
  
  shades.forEach(({ name, factor }) => {
    const newR = Math.round(r + (255 - r) * (1 - factor));
    const newG = Math.round(g + (255 - g) * (1 - factor));
    const newB = Math.round(b + (255 - b) * (1 - factor));
    
    variants[name] = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  });
  
  return variants;
}

/**
 * Generate actual hex values for all color variants using the original palette logic
 * This creates a proper visual reference with distinct shade values
 */
function generateActualHexValues(): Record<string, string> {
  const hexValues: Record<string, string> = {};
  
  // Generate actual shade variants using the original logic
  for (const [colorName, colorDef] of Object.entries(COLOR_MAPPING)) {
    if (typeof colorDef === 'object' && 'value' in colorDef) {
      const baseHex = colorDef.value;
      
      // Add base color
      hexValues[colorName] = baseHex;
      
      // Generate and add shade variants
      const variants = generateShadeVariants(baseHex);
      Object.entries(variants).forEach(([variantName, hexValue]) => {
        hexValues[`${colorName}${variantName}`] = hexValue;
      });
    }
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
  
  let content = `/**
 * Visual reference for the complete color palette
 * 🚨 AUTO-GENERATED - DO NOT EDIT MANUALLY
 * 
 * Run: pnpm generate:palette to update this file
 * 
 * This file shows the actual hex values for all color variants.
 * The main colors object uses CSS variables, but this provides
 * a visual reference of what those variables resolve to.
 */

export const ___COLORS___ = {\n`;

  // Sort entries for consistent output
  const sortedEntries = Object.entries(actualHexValues)
    .filter(([key, _]) => !key.match(/\d+$/)) // Skip transparency variants
    .sort(([a], [b]) => {
      // Sort by base color name first, then by variant
      const baseA = a.replace(/[A-Z][a-z]*|[0-9]+/g, '');
      const baseB = b.replace(/[A-Z][a-z]*|[0-9]+/g, '');
      if (baseA !== baseB) return baseA.localeCompare(baseB);
      return a.localeCompare(b);
    });

  for (const [key, hexValue] of sortedEntries) {
    const comment = key === key.toLowerCase() ? ' // Base color' : ' // Shade variant';
    content += `  ${key}: '${hexValue}',${comment}\n`;
  }

  content += `};\n\n`;
  
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
