/**
 * OKLCH Palette Utilities
 *
 * Calculation functions for converting simple config values
 * into actual OKLCH transformation values
 */

import type { CategoryTransformConfig, OKLCHTransformValues } from './oklch-palette.types';

/**
 * Calculate transformation values from simple config
 *
 * This is where the "magic" happens - converting human-readable config
 * (contrast: 1-10, chromaShift: 0-2) into actual OKLCH lightness/chroma adjustments.
 *
 * @param config - Simple contrast/chromaShift config
 * @param mode - Light or dark theme mode
 * @returns Actual OKLCH transformation values
 */
export function calculateTransformValues(
  config: CategoryTransformConfig,
  mode: 'light' | 'dark',
): OKLCHTransformValues {
  const { contrast, chromaShift } = config;

  // Convert contrast (1-10) to lightness step size (0.05 - 0.35)
  // Formula: baseStep * (contrast / 5)
  const baseStepLight = 0.12 * (contrast / 5); // Base step for light variants
  const baseStepDark = 0.12 * (contrast / 5); // Base step for dark variants

  // Chroma multiplier: how much saturation changes
  // Lighter shades reduce chroma, darker shades increase it
  const chromaBase = 0.15 * chromaShift;

  if (mode === 'light') {
    return {
      lightnessSteps: {
        XXLight: baseStepLight * 2.0, // Largest step
        XLight: baseStepLight * 1.5,
        Light: baseStepLight * 1.0,
        Dark: baseStepDark * 1.0,
        XDark: baseStepDark * 1.5,
        XXDark: baseStepDark * 2.0,
      },
      chromaMultipliers: {
        XXLight: 1 - chromaBase * 2, // Most desaturated
        XLight: 1 - chromaBase * 1.5,
        Light: 1 - chromaBase * 1,
        base: 1, // Original chroma
        Dark: 1 + chromaBase * 0.8,
        XDark: 1 + chromaBase * 1.2,
        XXDark: 1 + chromaBase * 1.5, // Most saturated
      },
      lightnessClamps: {
        min: 0.05,
        max: 0.95,
      },
    };
  } else {
    // Dark theme: slightly different ratios
    return {
      lightnessSteps: {
        XXLight: baseStepLight * 1.5, // Smaller steps in dark mode
        XLight: baseStepLight * 1.0,
        Light: baseStepLight * 0.6,
        Dark: baseStepDark * 1.2,
        XDark: baseStepDark * 1.8,
        XXDark: baseStepDark * 2.5, // Larger dark steps
      },
      chromaMultipliers: {
        XXLight: 1 - chromaBase * 1.5,
        XLight: 1 - chromaBase * 1.2,
        Light: 1 - chromaBase * 0.8,
        base: 1,
        Dark: 1 + chromaBase * 0.8,
        XDark: 1 + chromaBase * 1.2,
        XXDark: 1 + chromaBase * 1.5,
      },
      lightnessClamps: {
        min: 0.15,
        max: 0.98,
      },
    };
  }
}

