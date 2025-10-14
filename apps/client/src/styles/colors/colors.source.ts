import type { ColorMapping, HexColor } from './colors.types';
import type { ColorPalette } from './palette.types';
import { generateColorPaletteWithCssVars } from './utils/generate-project-palette.utils';
import tailwindColors from 'tailwindcss/colors';

/**
 * 🎨 Color mapping configuration using OKLCH color space
 * OKLCH provides perceptually uniform colors with wider gamut support
 * @see https://oklch.com - OKLCH color space reference
 * @see https://tailwindcss.com/docs/colors - Source: Tailwind color palette
 */
export const COLOR_MAPPING: Omit<ColorMapping, 'white' | 'black' | 'background'> = {
  primary: { value: 'oklch(48.8% 0.243 264.376)' }, // Tailwind blue-700
  secondary: { value: 'oklch(49.6% 0.265 301.924)' }, // Tailwind purple-700
  success: { value: 'oklch(62.7% 0.194 149.214)' }, // Tailwind green-600
  warning: { value: 'oklch(76.9% 0.188 70.08)' }, // Tailwind amber-500
  danger: { value: 'oklch(57.7% 0.245 27.325)' }, // Tailwind red-600
  info: { value: 'oklch(58.8% 0.158 241.966)' }, // Tailwind cyan-500
  default: { value: 'oklch(55.3% 0.013 58.071)' }, // Tailwind stone-500
  text: { value: 'oklch(26.9% 0 0)' }, // Tailwind neutral-800
  grey: { value: 'oklch(55.2% 0.016 285.938)' }, // Tailwind zinc-500
} as const;

export const colors: ColorPalette = {
  ...generateColorPaletteWithCssVars({ colors: COLOR_MAPPING }),
  background: 'var(--color-background)' as any,
};
