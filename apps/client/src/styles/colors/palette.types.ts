/**
 * Palette type definitions
 * Defines the structure and types for the generated color palette
 */
import type { RadixColorVariable } from '../radix-ui/radix.types';
import type {
  ColorBaseName,
  ColorName,
  ColorNameExtended,
  ColorValue,
  HexColor,
  ShadeVariant,
  TransparencyLevel,
} from './colors.types';

// ======================================================================== //
// PALETTE KEYS
// ======================================================================== //

/**
 * Base palette keys (before transparency variants)
 * Includes: base colors, extended colors, and shade variants
 */
type ColorPaletteKey = `${ColorNameExtended}` | `${ColorBaseName}${ShadeVariant}`;

/**
 * Complete set of all possible color palette keys
 * Includes: base colors, shade variants, transparency variants, and combined variants
 */
export type ColorPaletteKeysFull =
  | ColorPaletteKey
  | `${ColorBaseName}${TransparencyLevel}`
  | `${ColorBaseName}${ShadeVariant}${TransparencyLevel}`;

// ======================================================================== //
// CSS VARIABLE REFERENCES
// ======================================================================== //

/**
 * CSS variable reference type for all valid color variable patterns
 * Examples: 'var(--color-primary)', 'var(--color-info-dark)', 'var(--color-success-50)', 'var(--color-black-25)'
 */
export type CssVariableRef =
  | `var(--color-${ColorName})`
  | `var(--color-${ColorName}-${TransparencyLevel})`
  | `var(--color-${ColorBaseName}-${Lowercase<ShadeVariant>})`
  | `var(--color-${ColorBaseName}-${Lowercase<ShadeVariant>}-${TransparencyLevel})`;

// ======================================================================== //
// GENERATED PALETTE TYPES
// ======================================================================== //

/**
 * Complete color palette type that includes:
 * - Base colors (e.g., 'primary': 'var(--color-primary)')
 * - Shaded variants (e.g., 'primaryLight': 'var(--color-primary-light)')
 * - Transparency variants (e.g., 'primary50': 'var(--color-primary-50)')
 * - Combined shade+transparency variants (e.g., 'primaryLight33': 'var(--color-primary-light-33)')
 */

// TODO: IGNORE AND LEAVE FOR NOW
// export type ColorPalette = {
//   [K in `${ColorValidName}`]: CssVariableRef;
// } & {
//   [K in ColorBaseName as `${ColorBaseName}${ShadeVariant}${TransparencyLevel}`]: CssVariableRef;
// } & {
//   [K in ColorBaseName as `${ColorBaseName}${TransparencyLevel}`]: CssVariableRef;
// };

/**
 * Type for the generated color palette with all shade variants
 */
export type GeneratedPaletteCSS = {
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

/**
 * Colors that have shade variants (excludes background which is fixed)
 */
type ColorWithShades = Exclude<ColorBaseName, 'background'>;

/**
 * Color palette type - FULLY TYPED with autocomplete support! 🎯
 *
 * Structure:
 * - Base colors with shades: primary, primaryXXLight, primaryXLight, primaryLight, primaryDark, primaryXDark, primaryXXDark
 * - Transparency variants: primary25, primary50, primary75
 * - Shade + transparency: primaryXXLight25, primaryXXLight50, etc.
 * - Special: white/black (only transparency), transparent/background (no variants)
 *
 * Example autocomplete:
 * - colors.primary ✅
 * - colors.primaryLight ✅
 * - colors.primaryDark50 ✅
 * - colors.white25 ✅
 * - colors.whiteDark ❌ (white has no shades)
 * - colors.backgroundLight ❌ (background has no shades)
 */
export type ColorPalette =
  // Base colors with shade variants (primary, secondary, success, etc. - NOT background)
  {
    [K in ColorWithShades]: ColorValue;
  } & {
    // Shade variants (e.g., primaryXXLight, primaryLight, primaryDark)
    [K in ColorWithShades as `${K}${ShadeVariant}`]: ColorValue;
  } & {
    // Base transparency variants (e.g., primary25, primary50, primary75)
    [K in ColorWithShades as `${K}${TransparencyLevel}`]: ColorValue;
  } & {
    // Shade + transparency variants (e.g., primaryXXLight25, primaryDark50)
    [K in ColorWithShades as `${K}${ShadeVariant}${TransparencyLevel}`]: ColorValue;
  } &
  // White and black: ONLY transparency variants (no shades)
  {
    [K in ColorNameNoShadeVariant]: ColorValue;
  } & {
    [K in ColorNameNoShadeVariant as `${K}${TransparencyLevel}`]: ColorValue;
  } &
  // Special colors: transparent (no variants), background (no variants - fixed value)
  {
    transparent: 'transparent';
    background: ColorValue;
  };

/**
 * Helper type to extract the actual color value based on environment
 */
export type ColorPaletteValue<T> = T extends RadixColorVariable
  ? typeof window extends undefined
    ? RadixColorVariable
    : HexColor
  : T;
