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
 * Get the base hex value from our theme colors
 * Only show base colors and shade variants, not transparency variants
 */
function getHexValue(key: string, cssVar: string): string {
  // For transparency variants, return a descriptive comment instead
  if (key.match(/\d+$/)) {
    const match = cssVar.match(/var\(--color-([^)]+)\)/);
    if (match) {
      const opacity = key.match(/(\d+)$/)?.[1];
      return `/* ${opacity}% opacity of base color */`;
    }
  }
  
  // For fixed colors, return direct values
  if (key === 'white') return '#ffffff';
  if (key === 'black') return '#000000';
  if (key === 'transparent') return 'transparent';
  if (key === 'background') return lightColors.background as string;
  
  // For base colors, try to get from light theme
  const baseColorMatch = key.match(/^([a-z]+)/);
  if (baseColorMatch) {
    const baseColor = baseColorMatch[1];
    const themeValue = (lightColors as any)[key];
    if (typeof themeValue === 'string' && themeValue.startsWith('#')) {
      return themeValue;
    }
    
    // Fallback to base color if variant not found
    const baseValue = (lightColors as any)[baseColor];
    if (typeof baseValue === 'string' && baseValue.startsWith('#')) {
      return baseValue;
    }
  }
  
  // Fallback to CSS variable reference
  return cssVar;
}

/**
 * Generate the MY_PALETTE.ts file content
 */
function generatePaletteContent(): string {
  const palette = generateColorPaletteWithCssVars({ colors: COLOR_MAPPING });
  
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
  const sortedEntries = Object.entries(palette)
    .filter(([_, value]) => typeof value === 'string')
    .sort(([a], [b]) => {
      // Sort by base color name first, then by variant
      const baseA = a.replace(/[A-Z][a-z]*|[0-9]+/g, '');
      const baseB = b.replace(/[A-Z][a-z]*|[0-9]+/g, '');
      if (baseA !== baseB) return baseA.localeCompare(baseB);
      return a.localeCompare(b);
    });

  for (const [key, cssVar] of sortedEntries) {
    const hexValue = getHexValue(key, cssVar as string);
    
    // Skip transparency variants to keep file readable
    if (key.match(/\d+$/)) continue;
    
    const comment = key === key.toLowerCase() ? ' // Base color' : ' // Shade variant';
    
    content += `  ${key}: '${hexValue}',${comment}\n`;
  }

  content += `};\n\n`;
  
  content += `/**
 * Color system statistics:
 * - Base colors: ${Object.keys(COLOR_MAPPING).length}
 * - Total variants: ${sortedEntries.length}
 * - Shade variants: ${sortedEntries.filter(([key]) => !key.match(/\d+$/) && key !== key.toLowerCase()).length}
 * - Transparency variants: ${sortedEntries.filter(([key]) => key.match(/\d+$/)).length}
 */\n`;

  return content;
}

/**
 * Main function to generate and write the file
 */
function main() {
  try {
    const content = generatePaletteContent();
    const filePath = join(__dirname, '..', 'MY_PALETTE.ts');
    
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
