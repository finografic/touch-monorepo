import type { ColorMapping } from '../colors.types';
import type { ColorPalette } from '../palette.types';
import { generateColorPalette } from '../custom/custom.palette';

export const LIGHT_COLOR_MAPPING: Omit<ColorMapping, 'white' | 'black' | 'background'> = {
  primary: { value: '#1e3a8a' }, // Blue-900 - much darker blue for high contrast
  secondary: { value: '#047857' }, // Emerald-700 - deeper green for better contrast
  default: { value: '#111827' }, // Gray-900 - very dark for maximum contrast
  success: { value: '#065f46' }, // Emerald-800 - much deeper success green
  warning: { value: '#92400e' }, // Amber-800 - darker warning for better visibility
  danger: { value: '#991b1b' }, // Red-800 - deeper danger red
  info: { value: '#1e40af' }, // Blue-800 - darker info blue
  text: { value: '#000000' }, // Pure black for maximum readability
  grey: { value: '#1f2937' }, // Gray-800 - much darker gray
  gray: { value: '#1f2937' }, // Gray-800 - much darker gray
} as const;

export const lightColors: ColorPalette = {
  ...generateColorPalette({ colors: LIGHT_COLOR_MAPPING }),
  white: '#ffffff',
  black: '#000000',
  background: '#fefefe', // Pure white with subtle warmth
};
