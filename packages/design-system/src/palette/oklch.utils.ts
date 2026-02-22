/**
 * OKLCH color space utilities — parsing, formatting, and math helpers.
 */

import type { OklchColor } from './palette.types';

/**
 * Parse an `oklch(L% C H)` string into numeric components.
 * Accepts both percentage and decimal lightness:
 * - `oklch(48.8% 0.243 264.376)`
 * - `oklch(0.488 0.243 264.376)`
 */
export function parseOklch(raw: string): OklchColor {
  const match = raw.match(
    /oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)\s*\)/,
  );
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

/** Clamp a number between min and max (inclusive). */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
