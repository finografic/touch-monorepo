import type { ColorMapping, HexColor } from '../colors.types';
import type { ColorBaseName, ColorPalette, CssVariableRef, TransparencyLevel } from '../palette.types';
import { SHADE_PREFIX } from '../constants/palette.constants';
import { colorToCssVarRef } from '../utils/camelToKebab';

/**
 * Generate color palette that returns CSS variable references instead of hex values
 * This allows components to continue using ${colors.infoDark} syntax while leveraging CSS variables
 */
export const generateCssVarColorPalette = ({
  colors,
}: {
  colors: Omit<ColorMapping, 'white' | 'black' | 'background'>;
}): Partial<ColorPalette> => {
  const palette = {} as Partial<ColorPalette>;

  // Generate base colors and shade variants
  for (const [name] of Object.entries(colors) as [ColorBaseName, { value: HexColor }][]) {
    try {
      // Base color
      palette[name] = colorToCssVarRef(name) as CssVariableRef;

      // Shade variants
      Object.entries(SHADE_PREFIX).forEach(([shadeKey, suffix]) => {
        if (suffix) {
          // Skip 'base' which has empty suffix
          const variantName = `${name}${suffix}` as keyof ColorPalette;
          palette[variantName] = colorToCssVarRef(variantName) as CssVariableRef;
        }
      });

      // Transparency variants (5, 10, 20, 25, 30, 33, 40, 50, 60, 66, 70, 75, 80, 90, 95)
      const transparencyLevels: TransparencyLevel[] = [
        '5',
        '10',
        '20',
        '25',
        '30',
        '33',
        '40',
        '50',
        '60',
        '66',
        '70',
        '75',
        '80',
        '90',
        '95',
      ];

      // Base color transparency variants
      transparencyLevels.forEach((level) => {
        const variantName = `${name}${level}` as keyof ColorPalette;
        const cssVarName = `--color-${name}-${level}`;
        palette[variantName] = `var(${cssVarName})` as CssVariableRef;
      });

      // Combined shade + transparency variants (e.g., primaryLight33, dangerDark25)
      Object.entries(SHADE_PREFIX).forEach(([shadeKey, suffix]) => {
        if (suffix) {
          // Skip 'base' which has empty suffix
          transparencyLevels.forEach((level) => {
            const variantName = `${name}${suffix}${level}` as keyof ColorPalette;
            const cssVarName = `--color-${name}-${shadeKey}-${level}`;
            palette[variantName] = `var(${cssVarName})` as CssVariableRef;
          });
        }
      });
    } catch (error) {
      console.error(`Error generating CSS variable color variants for ${name}:`, error);
    }
  }

  return palette;
};

/**
 * Enhanced version of generateColorPalette that returns CSS variables
 * Maintains compatibility with existing color palette interface
 */
export const generateColorPaletteWithCssVars = ({
  colors,
}: {
  colors: Omit<ColorMapping, 'white' | 'black' | 'background'>;
}): ColorPalette => {
  const generatedPalette = generateCssVarColorPalette({ colors });

  // Add fixed colors that don't use CSS variables
  const fixedColors = {
    white: '#ffffff' as HexColor,
    black: '#000000' as HexColor,
    transparent: 'transparent' as HexColor,
  };

  // Also add CSS variable versions of fixed colors for consistency
  const fixedColorVars = {
    whiteVar: colorToCssVarRef('white') as CssVariableRef,
    blackVar: colorToCssVarRef('black') as CssVariableRef,
    transparentVar: colorToCssVarRef('transparent') as CssVariableRef,
  };

  return {
    ...generatedPalette,
    ...fixedColors,
    ...fixedColorVars,
  } as ColorPalette;
};
