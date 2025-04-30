import type { ColorMapping } from '../colors.types';
import type { ColorPalette } from '../palette.types';
import { generateColorPalette } from './custom.palette';

export const COLOR_MAPPING: Omit<ColorMapping, 'white' | 'black' | 'background'> = {
  primary: { value: '#5E9DB0' },
  secondary: { value: '#74CABF' },
  default: { value: '#595F5F' },
  success: { value: '#00ff00' },
  warning: { value: '#ffaa00' },
  danger: { value: '#ff4444' },
  info: { value: '#00bfff' },
  text: { value: '#666666' },
  grey: { value: '#999999' },
  gray: { value: '#999999' },
} as const;

export const colors: ColorPalette = {
  ...generateColorPalette({ colors: COLOR_MAPPING }),
  white: '#ffffff',
  black: '#000000',
  background: '#1A1A1A',
};
