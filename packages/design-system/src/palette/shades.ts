/**
 * Shade ramp computation — lightness interpolation, chroma tapering, and hue shifting.
 *
 * These functions work together to produce perceptually uniform shade steps
 * from a single OKLCH base color anchored at shade 500.
 */

import type { ShadeStop } from './palette.types';
import { clamp } from './oklch.utils';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Lightness floor for shade 950 (near-black endpoint) */
const DARK_FLOOR = 0.13;

/** Enable subtle hue rotation at shade extremes */
const HUE_SHIFT_ENABLED = true;

/** Maximum hue rotation in degrees (applied at shade 50 and 950) */
const MAX_HUE_SHIFT = 3;

/**
 * Chroma multipliers per shade stop.
 * Full chroma (1.0) at 400–600; tapered at extremes to prevent
 * neon tints (light end) and muddy darks (dark end).
 */
const CHROMA_TAPERS: Partial<Record<ShadeStop, number>> = {
  50: 0.15,
  100: 0.30,
  200: 0.55,
  300: 0.80,
  700: 0.90,
  800: 0.80,
  900: 0.65,
  950: 0.45,
};

/**
 * Dark side interpolation factors — how far between baseLightness
 * and DARK_FLOOR each shade should land.
 */
const DARK_FACTORS: [ShadeStop, number][] = [
  [600, 0.18],
  [700, 0.40],
  [800, 0.62],
  [900, 0.82],
  [950, 1.00],
];

/**
 * Light side absolute lightness targets.
 * These get adjusted upward when the base color is already light
 * (e.g. warning/amber with L ≈ 0.77).
 */
const LIGHT_TARGETS: [ShadeStop, number][] = [
  [50, 0.97],
  [100, 0.93],
  [200, 0.87],
  [300, 0.79],
  [400, 0.70],
];

/**
 * Blend ratios for adjusting light targets when base lightness
 * exceeds the target — shade 50 gets the least push (0.3),
 * shade 400 gets the most (0.95).
 */
const LIGHT_BLEND_RATIOS: Record<ShadeStop, number> = {
  50: 0.3,
  100: 0.5,
  200: 0.7,
  300: 0.85,
  400: 0.95,
  // Remaining stops unused on light side, but satisfy the type
  500: 0, 600: 0, 700: 0, 800: 0, 900: 0, 950: 0,
};

// ---------------------------------------------------------------------------
// Lightness ramp
// ---------------------------------------------------------------------------

/**
 * Build a full 11-stop lightness ramp anchored on the base color's
 * lightness at shade 500.
 *
 * Light side (50–400): absolute targets, adjusted upward for light bases.
 * Dark side (600–950): interpolated between base lightness and DARK_FLOOR.
 */
export function buildLightnessRamp(baseLightness: number): Record<ShadeStop, number> {
  const ramp: Record<number, number> = { 500: baseLightness };

  // Light side
  for (const [shade, target] of LIGHT_TARGETS) {
    if (baseLightness > target) {
      const ratio = LIGHT_BLEND_RATIOS[shade];
      ramp[shade] = clamp(baseLightness + (1.0 - baseLightness) * ratio, 0, 1);
    } else {
      ramp[shade] = target;
    }
  }

  // Dark side
  for (const [shade, factor] of DARK_FACTORS) {
    const l = shade === 950
      ? DARK_FLOOR
      : baseLightness - (baseLightness - DARK_FLOOR) * factor;
    ramp[shade] = clamp(l, 0, 1);
  }

  return ramp as Record<ShadeStop, number>;
}

// ---------------------------------------------------------------------------
// Chroma tapering
// ---------------------------------------------------------------------------

/**
 * Returns a chroma multiplier for the given shade.
 * Full chroma (1.0) for shades 400–600; tapered at extremes.
 */
export function chromaMultiplier(shade: ShadeStop): number {
  if (shade >= 400 && shade <= 600) return 1.0;
  return CHROMA_TAPERS[shade] ?? 1.0;
}

// ---------------------------------------------------------------------------
// Hue shift
// ---------------------------------------------------------------------------

/**
 * Apply a subtle hue rotation at shade extremes to mimic
 * natural pigment behavior:
 * - Light tints shift slightly warm (toward yellow)
 * - Dark shades shift slightly cool (toward blue)
 *
 * Maximum shift is ±MAX_HUE_SHIFT degrees. No shift at shade 500.
 */
export function hueShift(shade: ShadeStop, baseHue: number): number {
  if (!HUE_SHIFT_ENABLED) return baseHue;

  // No shift at 500 (base), max shift at extremes
  // Light side shifts warm (toward yellow), dark side shifts cool (toward blue)
  const normalizedDistance =
    shade < 500
      ? -(500 - shade) / 450 // 50 → -1.0,  400 → -0.22
      : (shade - 500) / 450; // 600 → +0.22, 950 → +1.0

  const shift = -normalizedDistance * MAX_HUE_SHIFT;
  return (baseHue + shift + 360) % 360;
}
