import type { ColorMapping } from '../colors.types';
import type { ColorPalette } from '../palette.types';
import { generateColorPalette } from '../custom/custom.palette';

export const DARK_COLOR_MAPPING: Omit<ColorMapping, 'white' | 'black' | 'background'> = {
  primary: { value: '#93c5fd' }, // Blue-300 - lighter for dark theme
  secondary: { value: '#6ee7b7' }, // Emerald-300 - lighter for dark theme
  default: { value: '#d1d5db' }, // Gray-300 - lighter for dark theme
  success: { value: '#6ee7b7' }, // Emerald-300 - lighter for dark theme
  warning: { value: '#fcd34d' }, // Amber-300 - lighter for dark theme
  danger: { value: '#fca5a5' }, // Red-300 - lighter for dark theme
  info: { value: '#93c5fd' }, // Blue-300 - lighter for dark theme
  text: { value: '#ffffff' }, // White - very light for dark theme
  grey: { value: '#d1d5db' }, // Gray-300 - lighter for dark theme
  gray: { value: '#d1d5db' }, // Gray-300 - lighter for dark theme
} as const;

export const darkColors: ColorPalette = {
  ...generateColorPalette({ colors: DARK_COLOR_MAPPING }),
  white: '#ffffff',
  black: '#000000',
  background: '#0f172a', // Darker slate background for better contrast
};
