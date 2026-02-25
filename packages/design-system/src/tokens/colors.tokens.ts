/**
 * 🎨 Design System Color Tokens
 *
 * Source-of-truth OKLCH color values, mapped from the existing client styles.
 * These are the base colors from which all semantic tokens are derived.
 *
 * Shade scale (11 stops) — word names map to the TW/Panda/Ark numeric standard:
 *
 *   xxxlight → 50   (near-white endpoint)
 *   xxlight  → 100
 *   xlight   → 200
 *   lighter  → 300
 *   light    → 400  (hover-on-light-bg, almost base)
 *   base     → 500  (anchor / DEFAULT)
 *   dark     → 600  (hover-on-solid-bg, active states)
 *   darker   → 700
 *   xdark    → 800
 *   xxdark   → 900
 *   xxxdark  → 950  (near-black endpoint)
 *
 * @see https://oklch.com - OKLCH color space reference
 */

// ============================================================================
// BASE OKLCH COLORS (source-of-truth)
// ============================================================================

export const baseColors = {
  primary: 'oklch(48.8% 0.243 264.376)', // Tailwind blue-700
  secondary: 'oklch(49.6% 0.265 301.924)', // Tailwind purple-700
  success: 'oklch(65.4% 0.194 149.214)', // Tailwind green-600
  warning: 'oklch(76.9% 0.188 70.08)', // Tailwind amber-500
  danger: 'oklch(57.7% 0.245 27.325)', // Tailwind red-600
  info: 'oklch(58.8% 0.158 241.966)', // Tailwind cyan-500
  default: 'oklch(55.3% 0.013 58.071)', // Tailwind stone-500
  grey: 'oklch(55.2% 0.016 285.938)', // Tailwind zinc-500
  text: 'oklch(28% 0 0)', // Tailwind neutral-800

  // Fixed colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

// ============================================================================
// PANDA CSS COLOR TOKENS
// ============================================================================

/**
 * Raw color palette for Panda CSS `tokens.colors`.
 *
 * Each color exposes 11 word-named shades plus a `DEFAULT` alias (= base)
 * so `{colors.primary}` resolves without a suffix.
 *
 * All shade values are computed at runtime via CSS color-mix(in oklch, …) —
 * zero build-time cost, perceptually uniform interpolation.
 *
 * Light-side percentages (% of base, remainder white):
 *   xxxlight → 5% | xxlight → 10% | xlight → 20% | lighter → 38% | light → 58%
 *
 * Dark-side percentages (% of base, remainder black):
 *   dark → 82% | darker → 65% | xdark → 47% | xxdark → 30% | xxxdark → 15%
 */
function buildShadeScale(base: string) {
  return {
    DEFAULT: { value: base },
    xxxlight: { value: `color-mix(in oklch, ${base} 5%, white)` },
    xxlight: { value: `color-mix(in oklch, ${base} 10%, white)` },
    xlight: { value: `color-mix(in oklch, ${base} 20%, white)` },
    lighter: { value: `color-mix(in oklch, ${base} 38%, white)` },
    light: { value: `color-mix(in oklch, ${base} 58%, white)` },
    base: { value: base },
    dark: { value: `color-mix(in oklch, ${base} 82%, black)` },
    darker: { value: `color-mix(in oklch, ${base} 65%, black)` },
    xdark: { value: `color-mix(in oklch, ${base} 47%, black)` },
    xxdark: { value: `color-mix(in oklch, ${base} 30%, black)` },
    xxxdark: { value: `color-mix(in oklch, ${base} 15%, black)` },
  };
}

export const colorTokens = {
  primary: buildShadeScale(baseColors.primary),
  secondary: buildShadeScale(baseColors.secondary),
  success: buildShadeScale(baseColors.success),
  warning: buildShadeScale(baseColors.warning),
  danger: buildShadeScale(baseColors.danger),
  info: buildShadeScale(baseColors.info),
  grey: buildShadeScale(baseColors.grey),
  neutral: buildShadeScale(baseColors.default),

  // Fixed
  white: { value: baseColors.white },
  black: { value: baseColors.black },
  transparent: { value: baseColors.transparent },
} as const;

// ============================================================================
// SEMANTIC COLOR TOKENS (for Panda CSS semanticTokens)
// ============================================================================

/**
 * Semantic tokens — role-based color aliases.
 * These define what colors MEAN in context, not what they ARE.
 *
 * References like `{colors.grey.xlight}` resolve at build time to the
 * underlying color-mix(in oklch, …) value — OKLCH throughout.
 *
 * Maps to the Ark UI blog's token structure:
 * bg, fg, border, accent — with light/dark mode conditions.
 */
export const semanticColorTokens = {
  bg: {
    DEFAULT: { value: { base: '{colors.white}', _dark: '{colors.black}' } },
    subtle: { value: { base: '{colors.grey.xlight}', _dark: 'oklch(15% 0.01 285)' } },
    muted: { value: { base: '{colors.grey.lighter}', _dark: 'oklch(20% 0.01 285)' } },
    emphasized: { value: { base: '{colors.grey.light}', _dark: 'oklch(25% 0.01 285)' } },
    inverted: { value: { base: '{colors.black}', _dark: '{colors.white}' } },
    panel: { value: { base: '{colors.white}', _dark: 'oklch(12% 0.01 285)' } },
    error: { value: { base: '{colors.danger.xlight}', _dark: 'oklch(20% 0.08 27)' } },
    warning: { value: { base: '{colors.warning.xlight}', _dark: 'oklch(20% 0.06 70)' } },
    success: { value: { base: '{colors.success.xlight}', _dark: 'oklch(20% 0.06 149)' } },
    info: { value: { base: '{colors.info.xlight}', _dark: 'oklch(20% 0.05 242)' } },
  },
  fg: {
    DEFAULT: { value: { base: baseColors.text, _dark: 'oklch(93% 0 0)' } },
    muted: { value: { base: 'oklch(40% 0.01 285)', _dark: 'oklch(65% 0.01 285)' } },
    subtle: { value: { base: '{colors.grey}', _dark: 'oklch(55% 0.01 285)' } },
    inverted: { value: { base: '{colors.white}', _dark: '{colors.black}' } },
    error: { value: { base: '{colors.danger}', _dark: '{colors.danger.light}' } },
    warning: { value: { base: '{colors.warning.dark}', _dark: '{colors.warning}' } },
    success: { value: { base: '{colors.success.dark}', _dark: '{colors.success}' } },
    info: { value: { base: '{colors.info.dark}', _dark: '{colors.info}' } },
  },
  border: {
    DEFAULT: { value: { base: '{colors.grey.lighter}', _dark: 'oklch(30% 0.01 285)' } },
    muted: { value: { base: '{colors.grey.xlight}', _dark: 'oklch(25% 0.01 285)' } },
    subtle: { value: { base: '{colors.grey.xlight}', _dark: 'oklch(20% 0.01 285)' } },
    emphasized: { value: { base: '{colors.grey.light}', _dark: 'oklch(40% 0.01 285)' } },
    inverted: { value: { base: baseColors.text, _dark: 'oklch(90% 0 0)' } },
    error: { value: { base: '{colors.danger}', _dark: '{colors.danger.light}' } },
    warning: { value: { base: '{colors.warning}', _dark: '{colors.warning.light}' } },
    success: { value: { base: '{colors.success}', _dark: '{colors.success.light}' } },
    info: { value: { base: '{colors.info}', _dark: '{colors.info.light}' } },
  },
  accent: {
    DEFAULT: { value: { base: '{colors.primary}', _dark: '{colors.primary.light}' } },
    contrast: { value: { base: '{colors.white}', _dark: '{colors.black}' } },
    fg: { value: { base: '{colors.primary.dark}', _dark: '{colors.primary.light}' } },
    subtle: { value: { base: '{colors.primary.xlight}', _dark: 'oklch(20% 0.08 264)' } },
    muted: { value: { base: '{colors.primary.lighter}', _dark: 'oklch(25% 0.1 264)' } },
    emphasized: { value: { base: '{colors.primary.light}', _dark: 'oklch(35% 0.15 264)' } },
    solid: { value: { base: '{colors.primary}', _dark: '{colors.primary}' } },
    focusRing: { value: { base: '{colors.primary.light}', _dark: '{colors.primary.light}' } },
  },
} as const;
