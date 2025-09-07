import type { ColorMapping, HexColor } from '../colors.types';
import type { ColorPalette } from '../palette.types';
import { generateColorPaletteWithCssVars } from '../utils/generate-project-palette.utils';
import tailwindColors from 'tailwindcss/colors';

export const COLOR_MAPPING: Omit<ColorMapping, 'white' | 'black' | 'background'> = {
  // 🎨 Tailwind OKLCH Colors - Beautiful, perceptually uniform colors!
  primary: { value: tailwindColors.blue[600] }, // oklch(0.6 0.15 250)
  secondary: { value: tailwindColors.emerald[600] }, // oklch(0.6 0.15 142)
  success: { value: tailwindColors.green[600] }, // oklch(0.6 0.15 142)
  warning: { value: tailwindColors.amber[500] }, // oklch(0.8 0.15 85)
  danger: { value: tailwindColors.red[600] }, // oklch(0.6 0.15 25)
  info: { value: tailwindColors.sky[600] }, // oklch(0.6 0.15 200)

  // Neutral colors using Tailwind's excellent grays
  default: { value: tailwindColors.gray[600] }, // oklch(0.6 0.02 0)
  text: { value: tailwindColors.gray[700] }, // oklch(0.5 0.02 0)
  grey: { value: tailwindColors.gray[500] }, // oklch(0.7 0.02 0)
  gray: { value: tailwindColors.gray[500] }, // oklch(0.7 0.02 0)

  // Special values
  transparent: { value: 'transparent' as HexColor },
} as const;

export const colors: ColorPalette = {
  ...generateColorPaletteWithCssVars({ colors: COLOR_MAPPING }),
  // Background is set in themes, so we use CSS variable
  background: 'var(--color-background)' as any,
};
