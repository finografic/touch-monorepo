import Color from 'color';
import type { HexColor } from '../colors.types';
import type { ColorBaseName, ColorPalette } from '../palette.types';
import { generateTWColorVariants } from './tailwind.color';
import { SHADES_CUSTOM_TW } from './tailwind.constants';

/**
 * Generate the complete color palette with all variants
 */

// export const generatePalette = ({ colors }: { colors: Record<ColorBaseName, HexColor> }) => {
export const generateTWColorPalette = ({ colors }: { colors: typeof SHADES_CUSTOM_TW }) => {
  const palette = {} as ColorPalette;

  for (const [name, value] of Object.entries(colors) as [ColorBaseName, HexColor][]) {
    try {
      Object.assign(palette, {
        ...generateTWColorVariants({
          name,
          color: Color(value),
          shadeConfig: SHADES_CUSTOM_TW,
        }),
        // Override specific colors if needed
        ...(name === 'grey' ? { greyXXLight: '#f2f2f2' } : {}),
      });
    } catch (error) {
      console.error(`Error generating color variants for ${name}:`, error);
    }
  }

  return palette;
};
