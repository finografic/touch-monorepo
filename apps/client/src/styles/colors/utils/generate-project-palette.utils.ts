import type { ColorBaseName, ColorMapping, HexColor, TransparencyLevel } from '../colors.types';
import type { ColorPalette, CssVariableRef } from '../palette.types';
import { TRANSPARENCY_LEVELS } from '../colors.types';
import { SHADE_PREFIX } from '../constants/palette.constants';
import { CSS_TRANSPARENCY_ONLY_COLORS } from '../constants/css-vars.constants';
import { colorToCssVarRef } from './camelToKebab';

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

      // Shade variants (skip for transparency-only colors like black/white)
      if (!CSS_TRANSPARENCY_ONLY_COLORS.includes(name as any)) {
        Object.entries(SHADE_PREFIX).forEach(([shadeKey, suffix]) => {
          if (suffix) {
            // Skip 'base' which has empty suffix
            const variantName = `${name}${suffix}` as keyof ColorPalette;
            palette[variantName] = colorToCssVarRef(variantName) as CssVariableRef;
          }
        });
      }

      // Base color transparency variants (for all colors including black/white)
      TRANSPARENCY_LEVELS.forEach((level) => {
        const variantName = `${name}${level}` as keyof ColorPalette;
        const cssVarName = `--color-${name}-${level}`;
        palette[variantName] = `var(${cssVarName})` as CssVariableRef;
      });

      // Combined shade + transparency variants (only for colors that have shade variants)
      if (!CSS_TRANSPARENCY_ONLY_COLORS.includes(name as any)) {
        Object.entries(SHADE_PREFIX).forEach(([shadeKey, suffix]) => {
          if (suffix) {
            // Skip 'base' which has empty suffix
            TRANSPARENCY_LEVELS.forEach((level) => {
              const variantName = `${name}${suffix}${level}` as keyof ColorPalette;
              const cssVarName = `--color-${name}-${shadeKey}-${level}`;
              palette[variantName] = `var(${cssVarName})` as CssVariableRef;
            });
          }
        });
      }
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

  // Add CSS variable versions of fixed colors for consistency
  const fixedColorVars = {
    whiteVar: colorToCssVarRef('white') as CssVariableRef,
    blackVar: colorToCssVarRef('black') as CssVariableRef,
    transparentVar: colorToCssVarRef('transparent') as CssVariableRef,
  };

  // Add transparency variants for black and white
  const blackWhiteTransparency = {
    // Black transparency variants
    ...TRANSPARENCY_LEVELS.reduce((acc, level) => {
      acc[`black${level}` as keyof ColorPalette] = `var(--color-black-${level})` as CssVariableRef;
      return acc;
    }, {} as Partial<ColorPalette>),

    // White transparency variants
    ...TRANSPARENCY_LEVELS.reduce((acc, level) => {
      acc[`white${level}` as keyof ColorPalette] = `var(--color-white-${level})` as CssVariableRef;
      return acc;
    }, {} as Partial<ColorPalette>),
  };

  return {
    ...generatedPalette,
    ...fixedColors,
    ...fixedColorVars,
    ...blackWhiteTransparency,
  } as ColorPalette;
};
