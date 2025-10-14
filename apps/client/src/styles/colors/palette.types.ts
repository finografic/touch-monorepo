import type { HexColor, ShadeSuffix } from './colors.types';
import type { RadixColorVariable } from '../radix-ui/radix.types';
import type { SHADE_VARIANTS } from 'styles/colors/constants/js.constants';

/**
 * Shade variant type derived from JS constants
 * Extracts the union type from the SHADE_VARIANTS array
 */
export type ShadeVariant = (typeof SHADE_VARIANTS)[number];

/**
 * Base color names available in the system
 */
export type ColorName =
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
  | 'black'
  | 'white';

/**
 * Color names that have NO SHADE VARIANTS
 * These colors cannot have lighter/darker variants (e.g., 'black' cannot be 'blackLight')
 */
type ColorNameNoShadeVariant = 'black' | 'white';

/**
 * Extended color names including transparent
 * Adds 'transparent' to the base ColorName union
 */
export type ColorNameExtended = ColorName | 'transparent';

/**
 * Color names that HAVE SHADE VARIANTS
 * Excludes black/white which cannot have lighter/darker variants
 */
type ColorBaseName = Exclude<ColorName, ColorNameNoShadeVariant>;

/**
 * Transparency levels for color variants
 */
export type TransparencyLevel = '25' | '50' | '75';

/**
 * Base palette keys (before transparency variants)
 * Includes: base colors, extended colors, and shade variants
 */
type ColorPaletteKey = `${ColorNameExtended}` | `${ColorBaseName}${ShadeSuffix}`;

/**
 * Complete set of all possible color palette keys
 * Includes: base colors, shade variants, transparency variants, and combined variants
 */
export type ColorPaletteKeysFull =
  | ColorPaletteKey
  | `${ColorBaseName}${TransparencyLevel}`
  | `${ColorBaseName}${ShadeSuffix}${TransparencyLevel}`;

/**
 * CSS variable reference type for all valid color variable patterns
 * Examples: 'var(--color-primary)', 'var(--color-info-dark)', 'var(--color-success-50)', 'var(--color-black-25)'
 */
export type CssVariableRef =
  | `var(--color-${ColorName})`
  | `var(--color-${ColorName}-${TransparencyLevel})`
  | `var(--color-${ColorBaseName}-${Lowercase<ShadeSuffix>})`
  | `var(--color-${ColorBaseName}-${Lowercase<ShadeSuffix>}-${TransparencyLevel})`;

/**
 * Complete color palette type that includes:
 * - Base colors (e.g., 'primary': 'var(--color-primary)')
 * - Shaded variants (e.g., 'primaryLight': 'var(--color-primary-light)')
 * - Transparency variants (e.g., 'primary50': 'var(--color-primary-50)')
 * - Combined shade+transparency variants (e.g., 'primaryLight33': 'var(--color-primary-light-33)')
 */

export type ColorPalette = {
  [K in `${ColorValidName}`]: CssVariableRef;
} & {
  [K in ColorBaseName as `${ColorBaseName}${ShadeSuffix}${TransparencyLevel}`]: CssVariableRef;
} & {
  [K in ColorBaseName as `${ColorBaseName}${TransparencyLevel}`]: CssVariableRef;
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
