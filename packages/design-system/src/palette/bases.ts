/**
 * 🎨 Design System Color Tokens
 *
 * Source-of-truth OKLCH color values, mapped from the existing client styles.
 * These are the base colors from which all semantic tokens are derived.
 *
 * @see https://oklch.com — OKLCH color picker
 * @see https://www.w3.org/TR/css-color-4/#ok-lab — W3C specification
 *
 * Shade scale (11 stops) — word names map to the TW/Panda/Ark numeric standard:
 *
 * SHADE SUFFIX    → SHADE  NOTES
 * ──────────────────────────────────────────────
 * xxxlight        → 50     near-white endpoint
 * xxlight         → 100
 * xlight          → 200
 * lighter         → 300    medium-light
 * light           → 400    hover-on-light-bg
 * base            → 500    anchor (DEFAULT)
 * dark            → 600    hover-on-solid-bg, active states
 * darker          → 700
 * xdark           → 800
 * xxdark          → 900
 * xxxdark         → 950    near-black endpoint
 */

import type { SemanticBase } from './palette.types';

export const SEMANTIC_BASES: Record<string, SemanticBase> = {
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
