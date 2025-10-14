import type { ColorBaseName, ColorName, ColorNameExtended, ShadeKey, ShadeSuffix } from '../colors.types';

/**
 * All base colors including those that don't have shade variants
 */
export const BASE_COLORS: Record<ColorNameExtended, ColorNameExtended> = {
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
