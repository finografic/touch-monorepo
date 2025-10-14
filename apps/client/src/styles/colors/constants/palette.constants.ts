import type { ShadeKey, ShadeSuffix } from '../colors.types';
import type { ColorBaseName } from '../palette.types';

export const BASE_COLORS: Record<ColorBaseName, ColorBaseName> = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
  text: 'text',
  background: 'background',
  default: 'default',
  grey: 'grey',
  gray: 'gray',
  black: 'black',
  white: 'white',
  transparent: 'transparent',
} as const;

/**
 * Mapping between ShadeKey and their PascalCase suffixes
 * Note: 'base' maps to an empty string as it represents the base color
 */
export const SHADE_PREFIX: Record<ShadeKey, ShadeSuffix | ''> = {
  xxlight: 'XXLight',
  xlight: 'XLight',
  light: 'Light',
  base: '',
  dark: 'Dark',
  xdark: 'XDark',
  xxdark: 'XXDark',
} as const;
