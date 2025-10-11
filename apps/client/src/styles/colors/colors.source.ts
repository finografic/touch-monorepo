import type { ColorMapping, HexColor } from './colors.types';
import type { ColorPalette } from './palette.types';
import { generateColorPaletteWithCssVars } from './utils/generate-project-palette.utils';
import tailwindColors from 'tailwindcss/colors';

/**
 * 🎨 Color mapping configuration supporting both:
 * - CSS HEX values and Tailwind / OKLCH ColorSpace values
 * @see https://tailwindcss.com/docs/colors - Tailwind color palette
 */
export const COLOR_MAPPING: Omit<ColorMapping, 'white' | 'black' | 'background'> = {
  primary: { value: tailwindColors.blue[700] }, // oklch(48.8% 0.243 264.376)
  secondary: { value: tailwindColors.purple[700] }, // oklch(49.6% 0.265 301.924)
  success: { value: tailwindColors.green[600] }, // oklch(62.7% 0.194 149.214)
  warning: { value: tailwindColors.amber[500] }, // oklch(76.9% 0.188 70.08)
  danger: { value: tailwindColors.red[600] }, // oklch(57.7% 0.245 27.325)
  info: { value: tailwindColors.cyan[500] }, // oklch(58.8% 0.158 241.966)
  default: { value: tailwindColors.stone[500] }, // oklch(55.3% 0.013 58.071)
  text: { value: tailwindColors.neutral[800] }, // oklch(26.9% 0 0)
  grey: { value: tailwindColors.zinc[500] }, // oklch(55.2% 0.016 285.938)
  gray: { value: tailwindColors.zinc[500] }, // oklch(55.2% 0.016 285.938)
  transparent: { value: 'transparent' as HexColor },
} as const;

export const colors: ColorPalette = {
  ...generateColorPaletteWithCssVars({ colors: COLOR_MAPPING }),
  background: 'var(--color-background)' as any,
};
