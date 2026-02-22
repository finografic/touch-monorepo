/**
 * Shared types for the OKLCH palette generator.
 */

/** Parsed OKLCH color components */
export interface OklchColor {
  /** Lightness: 0 (black) to 1 (white) */
  l: number;
  /** Chroma: 0 (grey) to ~0.4 (max saturation) */
  c: number;
  /** Hue: 0–360 degrees */
  h: number;
}

/** The 11 Panda CSS / Tailwind shade stops */
export const SHADE_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type ShadeStop = (typeof SHADE_STOPS)[number];

/** A complete shade ramp keyed by shade stop */
export type ShadePalette = Record<ShadeStop, string>;

/** Panda CSS token shape: `{ value: string }` */
export type PandaToken = { value: string };

/** A semantic base color entry for the generator */
export type SemanticBase = { readonly value: string };
