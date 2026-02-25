/**
 * 🎨 OKLCH Palette Generator — Panda CSS Compatible
 *
 * Generates 11-stop shade ramps (50–950) from a single OKLCH base color,
 * producing perceptually uniform steps optimized for the Panda CSS token system.
 *
 * Design principles:
 * - Lightness interpolation is non-linear (eased) to match how humans perceive shade steps
 * - Chroma tapers at extremes (very light/dark) to avoid neon tints and muddy darks
 * - Hue shifts slightly warm at light end, cool at dark end (natural perception bias)
 * - Base color anchors at shade 500; all other shades derived from it
 *
 * @example
 * ```ts
 * import { generatePalette, SEMANTIC_BASES } from './palette-generator';
 *
 * const primary = generatePalette(SEMANTIC_BASES.primary);
 * // → { 50: 'oklch(...)', 100: 'oklch(...)', ..., 950: 'oklch(...)' }
 * ```
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OklchColor {
  l: number /** Lightness: 0 (black) to 1 (white) */;
  c: number /** Chroma: 0 (grey) to ~0.4 (max saturation) */;
  h: number /** Hue: 0–360 degrees */;
}

/** The 11 Panda CSS / Tailwind shade stops */
export const SHADE_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type ShadeStop = (typeof SHADE_STOPS)[number];

export type ShadePalette = Record<ShadeStop, string>;

// ---------------------------------------------------------------------------
// OKLCH parsing & formatting
// ---------------------------------------------------------------------------

/**
 * Parse an `oklch(L% C H)` string into numeric components.
 * Accepts both `oklch(48.8% 0.243 264.376)` and `oklch(0.488 0.243 264.376)`.
 */
export function parseOklch(raw: string): OklchColor {
  const match = raw.match(/oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!match) throw new Error(`Invalid OKLCH string: "${raw}"`);

  const [, lStr, pct, cStr, hStr] = match;
  const l = pct === '%' ? parseFloat(lStr) / 100 : parseFloat(lStr);
  const c = parseFloat(cStr);
  const h = parseFloat(hStr);
  return { l, c, h };
}

/**
 * Format an OklchColor back to a CSS `oklch()` string.
 * Uses percentage lightness for readability.
 */
export function formatOklch({ l, c, h }: OklchColor): string {
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)})`;
}

// ---------------------------------------------------------------------------
// Easing & interpolation helpers
// ---------------------------------------------------------------------------

/**
 * Build the full lightness ramp anchored on the base color's lightness at 500.
 *
 * Light side (50–400): interpolate between near-white and base.
 * Dark side (600–950): interpolate between base and near-black.
 *
 * Uses an eased curve so middle shades are more spread out
 * and extremes are compressed (matching visual perception).
 */
function buildLightnessRamp(baseLightness: number): Record<ShadeStop, number> {
  // Light end targets (absolute values — these work well universally)
  const lightTargets: [ShadeStop, number][] = [
    [50, 0.97],
    [100, 0.93],
    [200, 0.87],
    [300, 0.79],
    [400, 0.7],
  ];

  // Dark end targets (relative to base — darker colors need less range)
  // We interpolate between baseLightness and a floor
  const darkFloor = 0.13; // shade 950 target
  const darkTargets: [ShadeStop, number][] = [
    [600, baseLightness - (baseLightness - darkFloor) * 0.18],
    [700, baseLightness - (baseLightness - darkFloor) * 0.4],
    [800, baseLightness - (baseLightness - darkFloor) * 0.62],
    [900, baseLightness - (baseLightness - darkFloor) * 0.82],
    [950, darkFloor],
  ];

  // If the base is already very light (e.g. warning/amber at L=0.77),
  // we need to push the light targets even lighter.
  // If the base is very dark, light targets naturally have more range.
  const adjustedLightTargets = lightTargets.map(([shade, target]): [ShadeStop, number] => {
    // Blend: if base is lighter than target, push target up proportionally
    if (baseLightness > target) {
      const ratio =
        shade === 50 ? 0.3 : shade === 100 ? 0.5 : shade === 200 ? 0.7 : shade === 300 ? 0.85 : 0.95;
      return [shade, baseLightness + (1.0 - baseLightness) * ratio];
    }
    return [shade, target];
  });

  const ramp: Record<number, number> = { 500: baseLightness };
  for (const [shade, l] of adjustedLightTargets) ramp[shade] = clamp(l, 0, 1);
  for (const [shade, l] of darkTargets) ramp[shade] = clamp(l, 0, 1);

  return ramp as Record<ShadeStop, number>;
}

// ---------------------------------------------------------------------------
// Chroma tapering
// ---------------------------------------------------------------------------

/**
 * At extreme lightness values, chroma must decrease or colors
 * will appear neon/oversaturated (light end) or muddy (dark end).
 *
 * This function returns a chroma multiplier for a given shade.
 */
function chromaMultiplier(shade: ShadeStop): number {
  // Full chroma around the base
  if (shade >= 400 && shade <= 600) return 1.0;

  // Taper chroma at extremes
  const tapers: Partial<Record<ShadeStop, number>> = {
    50: 0.15,
    100: 0.3,
    200: 0.55,
    300: 0.8,
    700: 0.9,
    800: 0.8,
    900: 0.65,
    950: 0.45,
  };

  return tapers[shade] ?? 1.0;
}

// ---------------------------------------------------------------------------
// Hue shift (optional, subtle)
// ---------------------------------------------------------------------------

/**
 * Slight hue rotation at extremes to mimic natural pigment behavior:
 * - Light tints shift slightly warm (toward yellow)
 * - Dark shades shift slightly cool (toward blue)
 *
 * This is subtle (±3°) and optional. Set HUE_SHIFT_ENABLED = false to disable.
 */
const HUE_SHIFT_ENABLED = true;
const MAX_HUE_SHIFT = 3; // degrees

function hueShift(shade: ShadeStop, baseHue: number): number {
  if (!HUE_SHIFT_ENABLED) return baseHue;

  // No shift at 500 (base), max shift at extremes
  // Light side shifts warm (toward yellow), dark side shifts cool (toward blue)
  const normalizedDistance =
    shade < 500
      ? -(500 - shade) / 450 // light side: 50→-1, 400→-0.22
      : (shade - 500) / 450; // dark side: 600→+0.22, 950→+1

  const shift = -normalizedDistance * MAX_HUE_SHIFT;
  return (baseHue + shift + 360) % 360;
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

/**
 * Generate a full 11-stop Panda CSS compatible shade palette
 * from a single OKLCH base color.
 *
 * @param base - OKLCH color string, e.g. `'oklch(48.8% 0.243 264.376)'`
 * @returns Record mapping shade stops (50–950) to OKLCH color strings
 */
export function generatePalette(base: string): ShadePalette {
  const { l: baseL, c: baseC, h: baseH } = parseOklch(base);
  const lightnessRamp = buildLightnessRamp(baseL);

  const palette = {} as ShadePalette;

  for (const shade of SHADE_STOPS) {
    const l = lightnessRamp[shade];
    const c = baseC * chromaMultiplier(shade);
    const h = hueShift(shade, baseH);

    palette[shade] = formatOklch({ l: clamp(l, 0, 1), c: Math.max(0, c), h });
  }

  return palette;
}

/**
 * Generate multiple palettes from a semantic color config.
 * Output is shaped for direct use in a Panda CSS theme config.
 *
 * @example
 * ```ts
 * const palettes = generateAllPalettes(SEMANTIC_BASES);
 * // Use in panda.config.ts:
 * // theme: { tokens: { colors: palettes } }
 * ```
 */
export function generateAllPalettes(
  bases: Record<string, { value: string }>,
): Record<string, Record<ShadeStop, { value: string }>> {
  const result: Record<string, Record<ShadeStop, { value: string }>> = {};

  for (const [name, { value }] of Object.entries(bases)) {
    const palette = generatePalette(value);
    const tokenized: Record<number, { value: string }> = {};
    for (const shade of SHADE_STOPS) {
      tokenized[shade] = { value: palette[shade] };
    }
    result[name] = tokenized as Record<ShadeStop, { value: string }>;
  }

  return result;
}

// ---------------------------------------------------------------------------
// Your semantic base colors
// ---------------------------------------------------------------------------

/**
 * Single source of truth for base colors.
 * Each is the "500" shade — all other shades are derived from it.
 */
export const SEMANTIC_BASES = {
  primary: { value: 'oklch(48.8% 0.243 264.376)' }, // blue-700 range
  secondary: { value: 'oklch(49.6% 0.265 301.924)' }, // purple-700 range
  success: { value: 'oklch(65.4% 0.194 149.214)' }, // green-600 range
  warning: { value: 'oklch(76.9% 0.188 70.08)' }, // amber-500 range
  danger: { value: 'oklch(57.7% 0.245 27.325)' }, // red-600 range
  info: { value: 'oklch(58.8% 0.158 241.966)' }, // cyan-500 range
  default: { value: 'oklch(55.3% 0.013 58.071)' }, // stone-500 range
  grey: { value: 'oklch(55.2% 0.016 285.938)' }, // zinc-500 range
  text: { value: 'oklch(28% 0.000 0)' }, // neutral-800 range
} as const;

// ---------------------------------------------------------------------------
// Panda CSS config integration example
// ---------------------------------------------------------------------------

/**
 * Usage in panda.config.ts:
 *
 * ```ts
 * import { generateAllPalettes, SEMANTIC_BASES } from './palette-generator';
 *
 * export default defineConfig({
 *   theme: {
 *     tokens: {
 *       colors: {
 *         ...generateAllPalettes(SEMANTIC_BASES),
 *         // Override or add one-offs:
 *         white: { value: 'oklch(100% 0 0)' },
 *         black: { value: 'oklch(0% 0 0)' },
 *       },
 *     },
 *   },
 * });
 *
 * // Then in styles:
 * css({ bg: 'primary.500' })   // your base primary
 * css({ bg: 'primary.100' })   // light tint
 * css({ bg: 'danger.700' })    // dark danger
 * ```
 */

// ---------------------------------------------------------------------------
// Mapping reference: Your old names → new shade keys
// ---------------------------------------------------------------------------

/**
 * Migration cheatsheet:
 *
 * OLD NAME        → SHADE  NOTES
 * ──────────────────────────────────────────────
 * (new)           → 50     near-white, bg tints
 * xxlight         → 100    lightest named variant
 * xlight          → 200    light variant
 * light           → 300    medium-light
 * (new)           → 400    hover-on-light-bg
 * base            → 500    your primary color
 * (new)           → 600    hover-on-solid-bg
 * dark            → 700    dark variant
 * xdark           → 800    extra dark
 * xxdark          → 900    darkest named variant
 * (new)           → 950    near-black, text on dark
 */

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
