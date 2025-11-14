import type { ColorMapping } from './colors.types';

/**
 * 🎨 Color Mapping - OKLCH Color Space Source
 *
 * This is the SINGLE SOURCE OF TRUTH for all color values in the app.
 *
 * OKLCH provides:
 * - Perceptually uniform colors (equal distance = equal perceived difference)
 * - Wider gamut support (P3 displays)
 * - Better color mixing and gradients
 *
 * @see https://oklch.com - OKLCH color space reference
 * @see https://www.w3.org/TR/css-color-4/#ok-lab - W3C specification
 *
 * Based on Tailwind color palette values, converted to OKLCH
 */
export const COLOR_MAPPING: Omit<ColorMapping, 'white' | 'black' | 'background'> = {
  primary: { value: 'oklch(48.8% 0.243 264.376)' }, // Tailwind blue-700
  secondary: { value: 'oklch(49.6% 0.265 301.924)' }, // Tailwind purple-700
  success: { value: 'oklch(72.7% 0.204 149.214)' }, // Tailwind green-600
  warning: { value: 'oklch(76.9% 0.188 70.08)' }, // Tailwind amber-500
  danger: { value: 'oklch(57.7% 0.245 27.325)' }, // Tailwind red-600
  info: { value: 'oklch(58.8% 0.158 241.966)' }, // Tailwind cyan-500
  default: { value: 'oklch(55.3% 0.013 58.071)' }, // Tailwind stone-500
  grey: { value: 'oklch(55.2% 0.016 285.938)' }, // Tailwind zinc-500
  text: { value: 'oklch(28% 0 0)' }, // Tailwind neutral-800
} as const;
