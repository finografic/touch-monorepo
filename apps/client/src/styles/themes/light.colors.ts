import type { ColorMapping } from '../colors.types';
import type { ColorPalette } from '../palette.types';
import { generateColorPalette } from '../custom/custom.palette';

export const LIGHT_COLOR_MAPPING: Omit<ColorMapping, 'white' | 'black' | 'background'> = {
  primary: { value: '#2563eb' }, // Blue-600
  secondary: { value: '#059669' }, // Emerald-600
  default: { value: '#6b7280' }, // Gray-500
  success: { value: '#10b981' }, // Emerald-500
  warning: { value: '#f59e0b' }, // Amber-500
  danger: { value: '#ef4444' }, // Red-500
  info: { value: '#3b82f6' }, // Blue-500
  text: { value: '#1f2937' }, // Gray-800
  grey: { value: '#6b7280' }, // Gray-500
  gray: { value: '#6b7280' }, // Gray-500
} as const;

export const lightColors: ColorPalette = {
  ...generateColorPalette({ colors: LIGHT_COLOR_MAPPING }),
  white: '#ffffff',
  black: '#000000',
  background: '#ffffff', // White background
};
