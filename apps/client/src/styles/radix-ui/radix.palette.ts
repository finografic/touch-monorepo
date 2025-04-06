import type { ColorMapping, HexColor, RadixBaseShade } from '../colors.types';
import { GeneratedPalette } from '../palette.types';
import { getRadixHex } from './radix.color';
import type { RadixColorName, RadixShade } from './radix.types';

type ColorMappingValue = ColorMapping[keyof ColorMapping];

/**
 * Type guard for color mappings with variants
 */
function isColorMappingWithVariants(
  mapping: ColorMappingValue,
): mapping is Extract<ColorMappingValue, { color: RadixColorName; shade: RadixBaseShade }> {
  return 'color' in mapping && 'shade' in mapping;
}

/**
 * Calculate variant shade using a non-linear distribution
 * This creates more contrast between variants while staying within Radix's 1-12 range
 */
function calculateVariantShade(baseShade: number, offset: number): RadixShade {
  // Use exponential offset for more dramatic shifts
  const exponentialOffset = Math.sign(offset) * Math.pow(Math.abs(offset), 1.5);
  const newShade = Math.round(baseShade + exponentialOffset);
  // Clamp between 1 and 12 (Radix's range)
  return Math.max(1, Math.min(12, newShade)) as RadixShade;
}

/**
 * Generate color palette from Radix colors
 * Variants use exponential offsets for better contrast
 */
export const generateRadixColorPalette = (
  colorMapping: Omit<ColorMapping, 'white' | 'black'>,
): GeneratedPalette => {
  // Start with fixed colors
  const fixedColors: Record<string, HexColor> = {
    white: '#ffffff' as HexColor,
    black: '#000000' as HexColor,
  } as const;

  return Object.entries(colorMapping).reduce((acc, [key, mapping]) => {
    // Handle direct value mappings (like background)
    if ('value' in mapping) {
      return {
        ...acc,
        [key]: mapping.value,
      };
    }

    // Handle color mappings with variants
    if (isColorMappingWithVariants(mapping)) {
      const { color, shade } = mapping;
      const variants = {
        [`${key}XXLight`]: getRadixHex(color, calculateVariantShade(shade, -3)),
        [`${key}XLight`]: getRadixHex(color, calculateVariantShade(shade, -2)),
        [`${key}Light`]: getRadixHex(color, calculateVariantShade(shade, -1)),
        [`${key}`]: getRadixHex(color, shade),
        [`${key}Dark`]: getRadixHex(color, calculateVariantShade(shade, 1)),
        [`${key}XDark`]: getRadixHex(color, calculateVariantShade(shade, 2)),
        [`${key}XXDark`]: getRadixHex(color, calculateVariantShade(shade, 3)),
      };

      // Add base color and its variants
      const result = { ...acc, ...variants };

      // If this is grey, add gray aliases
      if (key === 'grey') {
        Object.assign(result, {
          grayXXLight: variants.greyXXLight,
          grayXLight: variants.greyXLight,
          grayLight: variants.greyLight,
          gray: variants.grey,
          grayDark: variants.greyDark,
          grayXDark: variants.greyXDark,
          grayXXDark: variants.greyXXDark,
        });
      }

      return result;
    }

    return acc;
  }, fixedColors as GeneratedPalette);
};
