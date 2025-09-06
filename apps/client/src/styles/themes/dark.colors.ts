import type { ColorMapping } from '../colors.types';
import type { ColorPalette } from '../palette.types';
import { generateColorPalette } from '../custom/custom.palette';

export const DARK_COLOR_MAPPING: Omit<ColorMapping, 'white' | 'black' | 'background'> = {
  primary: { value: '#60a5fa' }, // Blue-400
  secondary: { value: '#34d399' }, // Emerald-400
  default: { value: '#9ca3af' }, // Gray-400
  success: { value: '#34d399' }, // Emerald-400
  warning: { value: '#fbbf24' }, // Amber-400
  danger: { value: '#f87171' }, // Red-400
  info: { value: '#60a5fa' }, // Blue-400
  text: { value: '#f9fafb' }, // Gray-50
  grey: { value: '#9ca3af' }, // Gray-400
  gray: { value: '#9ca3af' }, // Gray-400
} as const;

export const darkColors: ColorPalette = {
  ...generateColorPalette({ colors: DARK_COLOR_MAPPING }),
  white: '#ffffff',
  black: '#000000',
  background: '#1a1a1a', // Dark background
};
