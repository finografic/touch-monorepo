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
/**
 * Variance factor for generating shade variants
 * Controls the intensity of color variations
 * - 0.5 = subtle variations
 * - 0.8 = balanced variations (default)
 * - 1.0 = maximum variations
 */
export const SHADE_VARIANCE_FACTOR = 0.8;

/**
 * Saturation factor for color variants
 * Controls the saturation level of color variations
 * Optimized for OKLCH color space to avoid muddy colors
 *
 * - 0.7 = very desaturated (minimal use)
 * - 0.9 = professional look (clean, slightly desaturated)
 * - 1.0 = no saturation change
 * - 1.1 = enhanced saturation (vibrant but professional)
 * - 1.2 = high saturation (for emphasis)
 */
export const SATURATION_FACTOR = 0.9; // Optimized for OKLCH

/**
 * Saturation factor specifically for status colors (success, warning, danger, info)
 * Higher saturation for better visibility on touch screens
 *
 * - 1.0 = no saturation change
 * - 1.2 = vibrant (good for status indicators)
 * - 1.4 = high impact (maximum recommended)
 * - 1.6 = ultra vibrant (use with caution)
 */
export const STATUS_SATURATION_FACTOR = 1.6; // Maximum vibrancy - will be balanced with transparency in components

/**
 * Type definitions for JS constants
 */
export type JsShadeVariant = (typeof JS_SHADE_VARIANTS)[number];
export type JsShadeOrder = (typeof JS_SHADE_ORDER)[number];
