/**
 * OKLCH Palette Types
 *
 * Type definitions for the category-based OKLCH transformation system
 */

import type { ColorBaseName } from './colors.types';

// ============================================================================
// COLOR CATEGORIES
// ============================================================================

/**
 * Color categories for distinct transformation rules
 */
export const COLOR_CATEGORIES = {
  /** Primary brand colors (primary, secondary) */
  theme: ['primary', 'secondary'] as const,

  /** Status/semantic colors (success, warning, danger, info, default) */
  status: ['success', 'warning', 'danger', 'info', 'default'] as const,

  /** Grey/neutral colors */
  grey: ['grey'] as const,

  /** Text colors */
  text: ['text'] as const,
} as const;

export type ColorCategory = keyof typeof COLOR_CATEGORIES;

/**
 * Map color names to their categories
 */
export function getColorCategory(colorName: ColorBaseName): ColorCategory {
  for (const [category, colors] of Object.entries(COLOR_CATEGORIES)) {
    if ((colors as readonly string[]).includes(colorName)) {
      return category as ColorCategory;
    }
  }
  // Default fallback
  return 'theme';
}

// ============================================================================
// TRANSFORMATION CONFIG TYPES
// ============================================================================

/**
 * Transformation configuration for a color category
 *
 * @property contrast - Controls difference between shades (1-10)
 *   - Higher = more visible difference between Light/Dark variants
 *
 * @property chromaShift - Controls saturation changes (0-2)
 *   - Higher = more saturation change in darker/lighter shades
 */
export interface CategoryTransformConfig {
  /** Contrast level: 1 (subtle) to 10 (extreme) */
  contrast: number;
  /** Chroma shift intensity: 0 (none) to 2 (strong) */
  chromaShift: number;
}

/**
 * Transformation configuration per color category per theme mode
 */
export interface OKLCHPaletteConfig {
  light: Record<ColorCategory, CategoryTransformConfig>;
  dark: Record<ColorCategory, CategoryTransformConfig>;
}

// ============================================================================
// TRANSFORMATION VALUES
// ============================================================================

/**
 * Calculated OKLCH transformation values
 *
 * This is the internal representation after converting simple config
 * values into actual OKLCH lightness/chroma adjustments
 */
export interface OKLCHTransformValues {
  // Lightness adjustments for each shade variant
  lightnessSteps: {
    XXLight: number;
    XLight: number;
    Light: number;
    Dark: number;
    XDark: number;
    XXDark: number;
  };
  // Chroma multipliers for each shade variant
  chromaMultipliers: {
    XXLight: number;
    XLight: number;
    Light: number;
    base: number;
    Dark: number;
    XDark: number;
    XXDark: number;
  };
  // Lightness clamps (min/max bounds)
  lightnessClamps: {
    min: number;
    max: number;
  };
}
