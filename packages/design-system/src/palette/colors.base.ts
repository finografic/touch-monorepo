/**
 * 🎨 Design System Color Tokens
 *
 * Source-of-truth OKLCH color values, mapped from the existing client styles.
 * These are the base colors from which all semantic tokens are derived.
 *
 * @see https://oklch.com — OKLCH color picker
 * @see https://www.w3.org/TR/css-color-4/#ok-lab — W3C specification
 *
 */

export const BASE_COLORS = {
  primary: 'oklch(48.8% 0.243 264.376)', // Tailwind blue-700
  secondary: 'oklch(49.6% 0.265 301.924)', // Tailwind purple-700
  success: 'oklch(65.4% 0.194 149.214)', // Tailwind green-600
  warning: 'oklch(76.9% 0.188 70.08)', // Tailwind amber-500
  danger: 'oklch(57.7% 0.245 27.325)', // Tailwind red-600
  info: 'oklch(58.8% 0.158 241.966)', // Tailwind cyan-500
  default: 'oklch(55.3% 0.013 58.071)', // Tailwind stone-500
  grey: 'oklch(55.2% 0.016 285.938)', // Tailwind zinc-500
  text: 'oklch(28% 0 0)', // Tailwind neutral-800

  // fixed colors (not shades)
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

/**
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
