import type { ColorValue, HexColor, ShadeSuffix } from './colors.types';
import type { RadixColorVariable } from '../radix-ui/radix.types';

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
 * Transparency levels for color variants
 */
export type TransparencyLevel =
  | '5'
  | '10'
  | '20'
  | '25'
  | '30'
  | '33'
  | '40'
  | '50'
  | '60'
  | '66'
  | '70'
  | '75'
  | '80'
  | '90'
  | '95';

/**
 * CSS variable reference type
 * Examples: 'var(--color-primary)', 'var(--color-info-dark)', 'var(--color-success-50)'
 */
export type CssVariableRef = `var(--color-${string})`;

/**
 * Complete color palette type that includes:
 * - Base colors (e.g., 'primary': 'var(--color-primary)')
 * - Shaded variants (e.g., 'primaryLight': 'var(--color-primary-light)')
 * - Transparency variants (e.g., 'primary50': 'var(--color-primary-50)')
 * - Combined shade+transparency variants (e.g., 'primaryLight33': 'var(--color-primary-light-33)')
 */
export type ColorPalette = {
  [K in ColorBaseName | `${ColorBaseName}${ShadeSuffix}`]: CssVariableRef | HexColor;
} & {
  [K in ColorBaseName as `${K}${TransparencyLevel}`]: CssVariableRef | HexColor;
} & {
  [K in ColorBaseName as `${K}${ShadeSuffix}${TransparencyLevel}`]: CssVariableRef | HexColor;
};

// Type for the generated color palette
export type GeneratedPalette = {
  [K in ColorBaseName]: ColorValue | CssVariableRef;
} & {
  [K in ColorBaseName as `${K}Light`]: ColorValue | CssVariableRef;
} & {
  [K in ColorBaseName as `${K}XLight`]: ColorValue | CssVariableRef;
} & {
  [K in ColorBaseName as `${K}XXLight`]: ColorValue | CssVariableRef;
} & {
  [K in ColorBaseName as `${K}Dark`]: ColorValue | CssVariableRef;
} & {
  [K in ColorBaseName as `${K}XDark`]: ColorValue | CssVariableRef;
} & {
  [K in ColorBaseName as `${K}XXDark`]: ColorValue | CssVariableRef;
};

// Helper type to extract the actual color value based on environment
export type ColorPaletteValue<T> = T extends RadixColorVariable
  ? typeof window extends undefined
    ? RadixColorVariable
    : HexColor
  : T;
