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
 * Contrast value: 1-10 range
 * Use `contrast()` helper to create a valid contrast value
 */
export type Contrast = number & { readonly __brand: 'Contrast' };

/**
 * Chroma shift value: 0-2 range
 * Use `chromaShift()` helper to create a valid chromaShift value
 */
export type ChromaShift = number & { readonly __brand: 'ChromaShift' };

/**
 * Helper to create a valid Contrast value (1-10 range)
 * Clamps values outside range with a warning
 */
export function contrast(value: number): Contrast {
  if (value < 1 || value > 10) {
    console.warn(
      `⚠️  Contrast value ${value} is outside valid range (1-10). ` +
        `Clamping to ${Math.max(1, Math.min(10, value))}.`,
    );
  }
  return Math.max(1, Math.min(10, value)) as Contrast;
}

/**
 * Helper to create a valid ChromaShift value (0-2 range)
 * Clamps values outside range with a warning
 */
export function chromaShift(value: number): ChromaShift {
  if (value < 0 || value > 2) {
    console.warn(
      `⚠️  ChromaShift value ${value} is outside valid range (0-2). ` +
        `Clamping to ${Math.max(0, Math.min(2, value))}.`,
    );
  }
  return Math.max(0, Math.min(2, value)) as ChromaShift;
}

/**
 * Transformation configuration for a color category
 *
 * @property contrast - Controls difference between shades (1-10)
 *   - Higher = more visible difference between Light/Dark variants
 *   - Use `contrast()` helper to create valid values
 *
 * @property chromaShift - Controls saturation changes (0-2)
 *   - Higher = more saturation change in darker/lighter shades
 *   - Use `chromaShift()` helper to create valid values
 */
export interface CategoryTransformConfig {
  /** Contrast level: 1 (subtle) to 10 (extreme) */
  contrast: Contrast;
  /** Chroma shift intensity: 0 (none) to 2 (strong) */
  chromaShift: ChromaShift;
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
