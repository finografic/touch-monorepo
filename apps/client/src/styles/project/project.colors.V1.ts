import type { ColorMapping, HexColor } from '../colors.types';
import type { ColorPalette } from '../palette.types';
import { generateColorPaletteWithCssVars } from '../utils/generate-project-palette.utils';

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
  transparent: { value: 'transparent' as HexColor },
} as const;

export const colors: ColorPalette = {
  ...generateColorPaletteWithCssVars({ colors: COLOR_MAPPING }),
  // Background is set in themes, so we use CSS variable
  background: 'var(--color-background)' as any,
};
