import type { HexColor, ShadeSuffix } from './colors.types';
import type { RadixColorVariable } from '../radix-ui/radix.types';
import type { SHADE_VARIANTS } from 'styles/colors/constants/js.constants';

/**
 * Type definitions for JS constants
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
 * Extension color names that have NO SHADE VARIANTS
 */
type ColorNameNoShadeVariant = 'black' | 'white';

/**
 * Full extended color names available in the system
 */
export type ColorNameExtended = ColorName | 'transparent';

/**
 * Extension color names that have SHADE VARIANTS
 */
type ColorBaseName = Exclude<ColorName, ColorNameNoShadeVariant>;

/**
 * Transparency levels for color variants
 */
export type TransparencyLevel = '25' | '50' | '75';

/**
 * Base color names available in the system  - used for PALETTE KEYS (BEFORE TRANSPARENCY VARIANTS)
 */
type ColorPaletteKey = `${ColorNameExtended}` | `${ColorBaseName}${ShadeSuffix}`;

/**
 * All possible color palette keys including base colors, shade variants, and transparency variants
 */
export type ColorPaletteKeysFull =
  | ColorPaletteKey
  | `${ColorBaseName}${TransparencyLevel}`
  | `${ColorBaseName}${ShadeSuffix}${TransparencyLevel}`;

/**
 * CSS variable reference type
 * Examples: 'var(--color-primary)', 'var(--color-info-dark)', 'var(--color-success-50)'
 */

export type CssVariableRefFull =
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
// export type ColorPalette = {
//   [K in ColorBaseName | `${ColorBaseName}${ShadeSuffix}`]: CssVariableRef | HexColor;
// } & {
//   [K in ColorBaseName as `${K}${TransparencyLevel}`]: CssVariableRef | HexColor;
// } & {
//   [K in ColorBaseName as `${K}${ShadeSuffix}${TransparencyLevel}`]: CssVariableRef | HexColor;
// };

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
