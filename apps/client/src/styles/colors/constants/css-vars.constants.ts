/**
 * CSS-specific constants for color system
 * These constants are used for CSS variable generation and manipulation
 */

import {
  type ColorName,
  type ColorNameNoShadeVariant,
  type ShadeVariant,
  TRANSPARENCY_LEVELS,
} from 'styles/colors/colors.types';

/**
 * Base color names for CSS variable generation
 * These are the primary colors that get shade and transparency variants
 */
export const CSS_BASE_COLORS: ColorName[] = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'text',
  'grey',
  'default',
  'black',
  'white',
] as const;

/**
 * CSS shade variants in lowercase (used for CSS variable names)
 * Example: --color-primary-xxlight, --color-primary-xlight, etc.
 */
export const CSS_SHADE_VARIANTS: Lowercase<ShadeVariant>[] = [
  'xxlight',
  'xlight',
  'light',
  'dark',
  'xdark',
  'xxdark',
] as const;

/**
 * Colors that should only get transparency variants (no shade variants)
 * These colors don't have light/dark variants but still need transparency levels
 */
export const CSS_TRANSPARENCY_ONLY_COLORS: ColorNameNoShadeVariant[] = ['black', 'white'] as const;

/**
 * CSS variable prefix for all color variables
 */
export const CSS_COLOR_VAR_PREFIX = '--color-' as const;
