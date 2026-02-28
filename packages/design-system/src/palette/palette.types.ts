/**
 * Shared types for the OKLCH palette generator.
 */

/** Parsed OKLCH color components */
export interface OklchColor {
  l: number /** Lightness: 0 (black) to 1 (white) */;
  c: number /** Chroma: 0 (grey) to ~0.4 (max saturation) */;
  h: number /** Hue: 0–360 degrees */;
}

/** The 11 Panda CSS / Tailwind shade stops */
export const SHADE_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type ShadeStop = (typeof SHADE_STOPS)[number];

export type ShadePalette = Record<ShadeStop, string>;
export type PandaToken = { value: string };

/** A semantic base color entry for the generator */
export type SemanticBase = { readonly value: string };
