import type { ColorValue, HexColor, ShadeSuffix } from './colors.types';
import type { RadixColorVariable } from './radix-ui/radix.types';

/**
 * Base color names available in the system
 */
export type ColorBaseName =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'text'
  | 'background'
  | 'default'
  | 'grey'
  | 'gray'
  | 'white'
  | 'black'
  | 'transparent';

/**
 * Complete color palette type that includes:
 * - Base colors (e.g., 'primary': '#247590')
 * - Shaded variants (e.g., 'primaryLight': '#3a8ba5')
 */
export type ColorPalette = {
  [K in ColorBaseName | `${ColorBaseName}${ShadeSuffix}`]: HexColor;
};

// Type for the generated color palette
export type GeneratedPalette = {
  [K in ColorBaseName]: ColorValue;
} & {
  [K in ColorBaseName as `${K}Light`]: ColorValue;
} & {
  [K in ColorBaseName as `${K}XLight`]: ColorValue;
} & {
  [K in ColorBaseName as `${K}XXLight`]: ColorValue;
} & {
  [K in ColorBaseName as `${K}Dark`]: ColorValue;
} & {
  [K in ColorBaseName as `${K}XDark`]: ColorValue;
} & {
  [K in ColorBaseName as `${K}XXDark`]: ColorValue;
};

// Helper type to extract the actual color value based on environment
export type ColorPaletteValue<T> = T extends RadixColorVariable
  ? typeof window extends undefined
    ? RadixColorVariable
    : HexColor
  : T;
