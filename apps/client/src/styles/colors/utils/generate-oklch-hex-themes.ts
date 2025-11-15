/**
 * Generate hex-based theme files from OKLCH color space
 *
 * These files mirror the OKLCH palette but use hex values for:
 * 1. Visual reference in IDE (color swatch previews)
 * 2. Easy comparison with old RGB-based generation
 *
 * NOTE: The app uses OKLCH colors directly from generate-oklch-themes.ts
 * These hex files are for VISUAL REFERENCE ONLY.
 */

import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { COLOR_MAPPING } from '../colors.source';
import type { ColorBaseName } from '../colors.types';
import { OKLCH_PALETTE_CONFIG } from '../oklch-palette.config';
import { getColorCategory } from '../oklch-palette.types';
import { calculateTransformValues } from '../oklch-palette.utils';
import type { ColorPalette } from '../palette.types';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Parse OKLCH string to components
 */
function parseOKLCH(oklchString: string): { l: number; c: number; h: number } {
  const match = oklchString.match(/oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\)/);
  if (!match) throw new Error(`Invalid OKLCH string: ${oklchString}`);

  return {
    l: Number.parseFloat(match[1]) / 100,
    c: Number.parseFloat(match[2]),
    h: Number.parseFloat(match[3]),
  };
}

/**
 * Convert OKLCH to RGB
 * Using simplified conversion (approximation for sRGB gamut)
 *
 * For production-quality conversion, consider using a library like:
 * - culori: https://culorijs.org/
 * - colorjs.io: https://colorjs.io/
 *
 * This is a simplified version for visual reference.
 */
function oklchToRgb(l: number, c: number, h: number): { r: number; g: number; b: number } {
  // Convert to Lab first (OKLCH → OKLAB → XYZ → RGB)
  // OKLCH: L (0-1), C (chroma), H (hue in degrees)

  // Convert hue to radians
  const hRad = (h * Math.PI) / 180;

  // Convert to OKLab
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // OKLab to linear RGB (simplified matrix transformation)
  // Note: This is an approximation. For exact conversion, use a color library.
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  let r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let b_ = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

  // Gamma correction (linear RGB to sRGB)
  const gamma = (x: number) => {
    if (x >= 0.0031308) {
      return 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
    }
    return 12.92 * x;
  };

  r = gamma(r);
  g = gamma(g);
  b_ = gamma(b_);

  // Clamp to [0, 1] and convert to [0, 255]
  r = Math.max(0, Math.min(1, r)) * 255;
  g = Math.max(0, Math.min(1, g)) * 255;
  b_ = Math.max(0, Math.min(1, b_)) * 255;

  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b_),
  };
}

/**
 * Convert OKLCH string to hex
 */
function oklchToHex(oklchString: string): string {
  const { l, c, h } = parseOKLCH(oklchString);
  const { r, g, b } = oklchToRgb(l, c, h);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Generate OKLCH shade variants (same logic as generate-oklch-themes.ts)
 */
function generateOKLCHShades(
  oklchString: string,
  colorName: ColorBaseName,
  mode: 'light' | 'dark',
): Record<string, string> {
  const { l, c, h } = parseOKLCH(oklchString);

  const category = getColorCategory(colorName);
  const categoryConfig = OKLCH_PALETTE_CONFIG[mode][category];
  const transformValues = calculateTransformValues(categoryConfig, mode);

  const variants: Record<string, string> = {};
  const { lightnessSteps, chromaMultipliers, lightnessClamps } = transformValues;

  const toOKLCHString = (l: number, c: number, h: number): string => {
    return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)})`;
  };

  if (mode === 'light') {
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
 * Generate hex palette from OKLCH transformations
 */
function generateHexPaletteFromOKLCH(mode: 'light' | 'dark'): Record<string, string> {
  const hexPalette: Record<string, string> = {};

  // Process each color from COLOR_MAPPING
  Object.entries(COLOR_MAPPING).forEach(([colorName, { value }]) => {
    // Generate OKLCH shades
    const oklchShades = generateOKLCHShades(value, colorName as ColorBaseName, mode);

    // Convert each shade to hex
    hexPalette[colorName] = oklchToHex(oklchShades.base);
    hexPalette[`${colorName}XXLight`] = oklchToHex(oklchShades.XXLight);
    hexPalette[`${colorName}XLight`] = oklchToHex(oklchShades.XLight);
    hexPalette[`${colorName}Light`] = oklchToHex(oklchShades.Light);
    hexPalette[`${colorName}Dark`] = oklchToHex(oklchShades.Dark);
    hexPalette[`${colorName}XDark`] = oklchToHex(oklchShades.XDark);
    hexPalette[`${colorName}XXDark`] = oklchToHex(oklchShades.XXDark);
  });

  // Add fixed colors
  hexPalette.background = mode === 'light' ? '#fefefe' : '#0f172a';
  hexPalette.transparent = 'transparent';
  hexPalette.white = '#ffffff';
  hexPalette.black = '#000000';

  return hexPalette;
}

/**
 * Generate theme file content
 */
function generateThemeContent(themeName: 'light' | 'dark'): string {
  const hexPalette = generateHexPaletteFromOKLCH(themeName);
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
 * ${themeTitle} theme color palette - hex values converted from OKLCH
 * 🚨 AUTO-GENERATED - DO NOT EDIT MANUALLY
 * ${timestamp}
 *
 * Run: pnpm generate:themes to update this file
 *
 * ⚠️  VISUAL REFERENCE ONLY - App uses OKLCH colors from generate-oklch-themes.ts
 *
 * These hex values are OKLCH → Hex conversions for IDE color preview.
 * They use the same category-based transformation logic as the OKLCH palette:
 * - Configured via oklch-palette.config.ts
 * - Different transformation rules for theme/status/grey/text colors
 * - Ensures consistency between OKLCH (runtime) and hex (visual reference)
 */
export const ${themeName}Colors: ColorPalette = {
`;

  // Define color order to match original .hex.ts files
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

  const sortedColors: Array<[string, string]> = [];

  // Process colors in the defined order
  for (const baseName of colorOrder) {
    // Add base color
    if (hexPalette[baseName]) {
      sortedColors.push([baseName, hexPalette[baseName]]);
    }

    // Add shade variants in order
    const shadeOrder = ['XXLight', 'XLight', 'Light', 'Dark', 'XDark', 'XXDark'];
    for (const shade of shadeOrder) {
      const key = `${baseName}${shade}`;
      if (hexPalette[key]) {
        sortedColors.push([key, hexPalette[key]]);
      }
    }
  }

  let lastBaseColor = '';
  for (const [colorName, hexValue] of sortedColors) {
    const baseColor = colorName.replace(/[A-Z][a-z]*/g, '');

    // Add line break between different base colors
    if (lastBaseColor && baseColor !== lastBaseColor) {
      content += '\n';
    }

    content += `  ${colorName}: '${hexValue}',\n`;
    lastBaseColor = baseColor;
  }

  // Add fixed colors at the end
  content += `\n  background: '${hexPalette.background}',\n`;
  content += `  transparent: 'transparent',\n\n`;
  content += `  // Fixed colors\n`;
  content += `  white: '#ffffff',\n`;
  content += `  black: '#000000',\n`;
  content += `} as any; // Cast to avoid complex type checking for now\n`;

  return content;
}

/**
 * Main function to generate theme files
 */
function main() {
  try {
    const themesDir = join(__dirname, '../..', 'themes');

    // Generate light theme
    const lightContent = generateThemeContent('light');
    const lightPath = join(themesDir, 'light.colors.ts');
    writeFileSync(lightPath, lightContent, 'utf-8');

    // Generate dark theme
    const darkContent = generateThemeContent('dark');
    const darkPath = join(themesDir, 'dark.colors.ts');
    writeFileSync(darkPath, darkContent, 'utf-8');

    console.log('✅ Generated OKLCH-based hex theme files successfully!');
    console.log(`📄 Light theme: ${lightPath}`);
    console.log(`📄 Dark theme: ${darkPath}`);
    console.log('');
    console.log('🎨 These files mirror the OKLCH palette (from generate-oklch-themes.ts)');
    console.log('💡 Use for visual reference in IDE (color swatches)');
    console.log('⚠️  App uses OKLCH colors directly - these are for reference only!');
  } catch (error) {
    console.error('❌ Error generating theme files:', error);
    process.exit(1);
  }
}

// Run if this is the main module
main();

export { main as generateOKLCHHexThemes };

