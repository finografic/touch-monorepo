/**
 * JavaScript-specific constants for color system
 * These constants are used for JS object generation and manipulation
 */

/**
 * JS shade variants in PascalCase (used for JS object keys)
 * Example: primaryXXLight, primaryXLight, etc.
 */
export const JS_SHADE_VARIANTS = ['XXLight', 'XLight', 'Light', 'Dark', 'XDark', 'XXDark'] as const;

/**
 * JS shade order for logical sorting (base first, then lightest to darkest)
 * Used for consistent ordering in generated palettes
 */
export const JS_SHADE_ORDER = [
  '', // Base color (no suffix)
  'XXLight', // Lightest
  'XLight',
  'Light',
  'Dark',
  'XDark',
  'XXDark', // Darkest
] as const;

/**
 * Variance factor for generating shade variants
 * Controls the intensity of color variations
 * - 0.5 = subtle variations
 * - 0.8 = balanced variations (default)
 * - 1.0 = maximum variations
 */
export const SHADE_VARIANCE_FACTOR = 0.8;

/**
 * Type definitions for JS constants
 */
export type JsShadeVariant = (typeof JS_SHADE_VARIANTS)[number];
export type JsShadeOrder = (typeof JS_SHADE_ORDER)[number];
