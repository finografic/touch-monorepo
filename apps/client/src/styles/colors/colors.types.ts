/**
 * Basic color type definitions and hex color validation
 */

// ======================================================================== //
// COLOR NAMES
// ======================================================================== //

/**
 * All color names as a constant array (for runtime iteration/validation)
 */
export const COLOR_NAMES = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'text',
  'background',
  'default',
  'grey',
  'black',
  'white',
] as const;

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
  | 'black'
  | 'white';

/**
 * Color names that have NO SHADE VARIANTS
 * These colors cannot have lighter/darker variants (e.g., 'black' cannot be 'blackLight')
 */
export type ColorNameNoShadeVariant = 'black' | 'white';

/**
 * Extended color names including transparent
 * Adds 'transparent' to the base ColorName union
 */
export type ColorNameExtended = ColorName | 'transparent';

/**
 * Color names that HAVE SHADE VARIANTS
 * Excludes black/white which cannot have lighter/darker variants
 */
export type ColorBaseName = Exclude<ColorName, ColorNameNoShadeVariant>;

/**
 * Color base names as a constant array (colors that have shade variants)
 * Excludes black/white which only have transparency variants
 */
export const COLOR_BASE_NAMES: ColorBaseName[] = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'text',
  'background',
  'default',
  'grey',
] as const;

/**
 * UI component color names (excludes text/background which aren't typically used for components)
 * This is the recommended set for UI elements like buttons, alerts, badges, etc.
 */
export const UI_COLOR_NAMES: ColorBaseName[] = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'default',
  'grey',
] as const;

// ======================================================================== //
// SHADES & VARIANTS
// ======================================================================== //

/**
 * Shade variants in PascalCase - used as suffixes with color names
 * Example: primaryXXLight, primaryXLight, etc.
 */
export const SHADE_VARIANTS = ['XXLight', 'XLight', 'Light', 'Dark', 'XDark', 'XXDark'] as const;
export type ShadeVariant = (typeof SHADE_VARIANTS)[number];

/**
 * Legacy type alias for ShadeVariant (for backwards compatibility)
 * @deprecated Use ShadeVariant instead
 */
export type ShadeSuffix = ShadeVariant;

/**
 * Shade keys in lowercase (used in configuration and mapping)
 * Note: 'base' is handled specially and doesn't have a suffix
 */
export type ShadeKey = Lowercase<ShadeVariant> | 'base';

/**
 * All transparency levels (legacy - full set for backwards compatibility)
 * Used for palette generation where all levels are needed
 */
// NOTE: V1 - ALL SHADE LEVELS
// export const TRANSPARENCY_LEVELS_LEGACY = [5, 10, 20, 25, 30, 33, 40, 50, 60, 66, 70, 75, 80, 90, 95] as const;

// NEW: V2 - SMALLER SET OF SHADE LEVELS for Optimization
export const TRANSPARENCY_LEVELS = [25, 50, 75] as const;
export type TransparencyLevel = (typeof TRANSPARENCY_LEVELS)[number];

// ======================================================================== //
// COLOR VALUES
// ======================================================================== //

/**
 * Hex color validation type
 */
export type HexColor = Lowercase<`#${HexChar}${string}`> | Uppercase<`#${HexChar}${string}`> | 'transparent';
type HexChar = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f';

/**
 * OKLCH color format (CSS Color Level 4)
 * Format: oklch(L% C H) or oklch(L% C H / A)
 * - L: Lightness (0-100%)
 * - C: Chroma (0+, typically 0-0.4)
 * - H: Hue (0-360deg)
 * - A: Alpha (0-1, optional)
 */
export type OklchColor = `oklch(${string})`;

/**
 * Union of all valid color value formats
 */
export type ColorValue = HexColor | OklchColor | string;

// ======================================================================== //
// COLOR MAPPING
// ======================================================================== //

/**
 * Color mapping structure - defines the source values for all colors
 * Each color must have a value property containing an OKLCH color string
 */
export type ColorMapping = {
  [K in ColorBaseName]: {
    value: OklchColor;
  };
};
