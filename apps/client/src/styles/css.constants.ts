/**
 * CSS-specific constants for color system
 * These constants are used for CSS variable generation and manipulation
 */

/**
 * CSS shade variants in lowercase (used for CSS variable names)
 * Example: --color-primary-xxlight, --color-primary-xlight, etc.
 */
export const CSS_SHADE_VARIANTS = ['xxlight', 'xlight', 'light', 'dark', 'xdark', 'xxdark'] as const;

/**
 * CSS transparency levels for color-mix() function
 * Used to generate transparent color variants
 */
export const CSS_TRANSPARENCY_LEVELS = [5, 10, 20, 25, 30, 33, 40, 50, 60, 66, 70, 75, 80, 90, 95] as const;

/**
 * Base color names for CSS variable generation
 * These are the primary colors that get shade and transparency variants
 */
export const CSS_BASE_COLORS = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'text',
  'grey',
  'gray',
  'default',
] as const;

/**
 * CSS variable prefix for all color variables
 */
export const CSS_COLOR_VAR_PREFIX = '--color-' as const;

/**
 * Type definitions for CSS constants
 */
export type CssShadeVariant = (typeof CSS_SHADE_VARIANTS)[number];
export type CssTransparencyLevel = (typeof CSS_TRANSPARENCY_LEVELS)[number];
export type CssBaseColor = (typeof CSS_BASE_COLORS)[number];
