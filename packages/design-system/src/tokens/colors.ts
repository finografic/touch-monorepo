/**
 * 🎨 Design System Color Tokens
 *
 * Source-of-truth OKLCH color values, mapped from the existing client styles.
 * These are the base colors from which all semantic tokens are derived.
 *
 * @see https://oklch.com - OKLCH color space reference
 * Based on Tailwind color palette values, converted to OKLCH
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
 * Raw color palette for Panda CSS `tokens.colors`
 *
 * These map directly to your existing shade system:
 * base, XXLight, XLight, Light, Dark, XDark, XXDark
 *
 * Rather than hardcoding generated shades here (which would duplicate
 * your OKLCH generation logic), we use CSS color-mix() for shade
 * derivation — letting the browser handle it with zero build-time cost.
 */
export const colorTokens = {
  // Core palette
  primary: {
    DEFAULT: { value: baseColors.primary },
    light: { value: `color-mix(in oklch, ${baseColors.primary} 40%, white)` },
    lighter: { value: `color-mix(in oklch, ${baseColors.primary} 20%, white)` },
    lightest: { value: `color-mix(in oklch, ${baseColors.primary} 10%, white)` },
    dark: { value: `color-mix(in oklch, ${baseColors.primary} 80%, black)` },
    darker: { value: `color-mix(in oklch, ${baseColors.primary} 60%, black)` },
  },
  secondary: {
    DEFAULT: { value: baseColors.secondary },
    light: { value: `color-mix(in oklch, ${baseColors.secondary} 40%, white)` },
    lighter: { value: `color-mix(in oklch, ${baseColors.secondary} 20%, white)` },
    lightest: { value: `color-mix(in oklch, ${baseColors.secondary} 10%, white)` },
    dark: { value: `color-mix(in oklch, ${baseColors.secondary} 80%, black)` },
    darker: { value: `color-mix(in oklch, ${baseColors.secondary} 60%, black)` },
  },
  success: {
    DEFAULT: { value: baseColors.success },
    light: { value: `color-mix(in oklch, ${baseColors.success} 40%, white)` },
    lighter: { value: `color-mix(in oklch, ${baseColors.success} 20%, white)` },
    lightest: { value: `color-mix(in oklch, ${baseColors.success} 10%, white)` },
    dark: { value: `color-mix(in oklch, ${baseColors.success} 80%, black)` },
    darker: { value: `color-mix(in oklch, ${baseColors.success} 60%, black)` },
  },
  warning: {
    DEFAULT: { value: baseColors.warning },
    light: { value: `color-mix(in oklch, ${baseColors.warning} 40%, white)` },
    lighter: { value: `color-mix(in oklch, ${baseColors.warning} 20%, white)` },
    lightest: { value: `color-mix(in oklch, ${baseColors.warning} 10%, white)` },
    dark: { value: `color-mix(in oklch, ${baseColors.warning} 80%, black)` },
    darker: { value: `color-mix(in oklch, ${baseColors.warning} 60%, black)` },
  },
  danger: {
    DEFAULT: { value: baseColors.danger },
    light: { value: `color-mix(in oklch, ${baseColors.danger} 40%, white)` },
    lighter: { value: `color-mix(in oklch, ${baseColors.danger} 20%, white)` },
    lightest: { value: `color-mix(in oklch, ${baseColors.danger} 10%, white)` },
    dark: { value: `color-mix(in oklch, ${baseColors.danger} 80%, black)` },
    darker: { value: `color-mix(in oklch, ${baseColors.danger} 60%, black)` },
  },
  info: {
    DEFAULT: { value: baseColors.info },
    light: { value: `color-mix(in oklch, ${baseColors.info} 40%, white)` },
    lighter: { value: `color-mix(in oklch, ${baseColors.info} 20%, white)` },
    lightest: { value: `color-mix(in oklch, ${baseColors.info} 10%, white)` },
    dark: { value: `color-mix(in oklch, ${baseColors.info} 80%, black)` },
    darker: { value: `color-mix(in oklch, ${baseColors.info} 60%, black)` },
  },
  grey: {
    DEFAULT: { value: baseColors.grey },
    light: { value: `color-mix(in oklch, ${baseColors.grey} 40%, white)` },
    lighter: { value: `color-mix(in oklch, ${baseColors.grey} 20%, white)` },
    lightest: { value: `color-mix(in oklch, ${baseColors.grey} 10%, white)` },
    dark: { value: `color-mix(in oklch, ${baseColors.grey} 80%, black)` },
    darker: { value: `color-mix(in oklch, ${baseColors.grey} 60%, black)` },
  },
  neutral: {
    DEFAULT: { value: baseColors.default },
    light: { value: `color-mix(in oklch, ${baseColors.default} 40%, white)` },
    lighter: { value: `color-mix(in oklch, ${baseColors.default} 20%, white)` },
    lightest: { value: `color-mix(in oklch, ${baseColors.default} 10%, white)` },
    dark: { value: `color-mix(in oklch, ${baseColors.default} 80%, black)` },
    darker: { value: `color-mix(in oklch, ${baseColors.default} 60%, black)` },
  },

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
 * Maps to the Ark UI blog's token structure:
 * bg, fg, border, accent — with light/dark mode conditions.
 */
export const semanticColorTokens = {
  bg: {
    DEFAULT: { value: { base: '{colors.white}', _dark: '{colors.black}' } },
    subtle: { value: { base: '{colors.grey.lightest}', _dark: 'oklch(15% 0.01 285)' } },
    muted: { value: { base: '{colors.grey.lighter}', _dark: 'oklch(20% 0.01 285)' } },
    emphasized: { value: { base: '{colors.grey.light}', _dark: 'oklch(25% 0.01 285)' } },
    inverted: { value: { base: '{colors.black}', _dark: '{colors.white}' } },
    panel: { value: { base: '{colors.white}', _dark: 'oklch(12% 0.01 285)' } },
    error: { value: { base: '{colors.danger.lightest}', _dark: 'oklch(20% 0.08 27)' } },
    warning: { value: { base: '{colors.warning.lightest}', _dark: 'oklch(20% 0.06 70)' } },
    success: { value: { base: '{colors.success.lightest}', _dark: 'oklch(20% 0.06 149)' } },
    info: { value: { base: '{colors.info.lightest}', _dark: 'oklch(20% 0.05 242)' } },
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
    muted: { value: { base: '{colors.grey.lightest}', _dark: 'oklch(25% 0.01 285)' } },
    subtle: { value: { base: '{colors.grey.lightest}', _dark: 'oklch(20% 0.01 285)' } },
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
    subtle: { value: { base: '{colors.primary.lightest}', _dark: 'oklch(20% 0.08 264)' } },
    muted: { value: { base: '{colors.primary.lighter}', _dark: 'oklch(25% 0.1 264)' } },
    emphasized: { value: { base: '{colors.primary.light}', _dark: 'oklch(35% 0.15 264)' } },
    solid: { value: { base: '{colors.primary}', _dark: '{colors.primary}' } },
    focusRing: { value: { base: '{colors.primary.light}', _dark: '{colors.primary.light}' } },
  },
} as const;
