import type { ColorMapping } from '../colors.types';
import type { ColorPalette } from '../palette.types';
import { generateColorPalette } from '../custom/custom.palette';

export const LIGHT_COLOR_MAPPING: Omit<ColorMapping, 'white' | 'black' | 'background'> = {
  primary: { value: '#1d4ed8' }, // Blue-700 - darker for light theme
  secondary: { value: '#047857' }, // Emerald-700 - darker for light theme
  default: { value: '#374151' }, // Gray-700 - darker for light theme
  success: { value: '#059669' }, // Emerald-600
  warning: { value: '#d97706' }, // Amber-600 - darker for light theme
  danger: { value: '#dc2626' }, // Red-600 - darker for light theme
  info: { value: '#2563eb' }, // Blue-600 - darker for light theme
  text: { value: '#111827' }, // Gray-900 - very dark for light theme
  grey: { value: '#4b5563' }, // Gray-600 - darker for light theme
  gray: { value: '#4b5563' }, // Gray-600 - darker for light theme
} as const;

export const lightColors: ColorPalette = {
  ...generateColorPalette({ colors: LIGHT_COLOR_MAPPING }),
  white: '#ffffff',
  black: '#000000',
  background: '#f8fafc', // Light gray background for better contrast
};
