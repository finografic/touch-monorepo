/**
 * CSS-specific constants for color system
 * These constants are used for CSS variable generation and manipulation
 */

import type { ColorName, ShadeSuffix } from 'styles/colors/colors.types';
import type { ColorNameNoShadeVariant } from 'styles/colors/palette.types';

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
  'gray',
  'default',
  'black',
  'white',
] as const;

/**
 * CSS shade variants in lowercase (used for CSS variable names)
 * Example: --color-primary-xxlight, --color-primary-xlight, etc.
 */
export const CSS_SHADE_VARIANTS: Lowercase<ShadeSuffix>[] = [
  'xxlight',
  'xlight',
  'light',
  'dark',
  'xdark',
  'xxdark',
] as const;

/**
 * CSS transparency levels for color-mix() function
 * Used to generate transparent color variants
 */

// NOTE: V1 - ALL SHADE LEVELS
// export const CSS_TRANSPARENCY_LEVELS = [5, 10, 20, 25, 30, 33, 40, 50, 60, 66, 70, 75, 80, 90, 95] as const;

// NEW: V2 - SMALLER SET OF SHADE LEVELS for Optimization
export const CSS_TRANSPARENCY_LEVELS = [25, 50, 75] as const;

/**
 * Colors that should only get transparency variants (no shade variants)
 * These colors don't have light/dark variants but still need transparency levels
 */
export const CSS_TRANSPARENCY_ONLY_COLORS: ColorNameNoShadeVariant[] = ['black', 'white'] as const;

/**
 * CSS variable prefix for all color variables
 */
export const CSS_COLOR_VAR_PREFIX = '--color-' as const;

/**
 * Type definitions for CSS constants
 */

export type CssBaseColor = (typeof CSS_BASE_COLORS)[number];
export type CssShadeVariant = (typeof CSS_SHADE_VARIANTS)[number];
export type CssTransparencyLevel = (typeof CSS_TRANSPARENCY_LEVELS)[number];
