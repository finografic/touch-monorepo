import { BASE_COLORS } from '../palette/colors.base';
import { buildShadeScale } from '../palette/shades.utils';

export const colorTokens = {
  primary: buildShadeScale(BASE_COLORS.primary),
  secondary: buildShadeScale(BASE_COLORS.secondary),
  success: buildShadeScale(BASE_COLORS.success),
  warning: buildShadeScale(BASE_COLORS.warning),
  danger: buildShadeScale(BASE_COLORS.danger),
  info: buildShadeScale(BASE_COLORS.info),
  grey: buildShadeScale(BASE_COLORS.grey),
  neutral: buildShadeScale(BASE_COLORS.default),

  // fixed colors (not shades)
  white: { value: BASE_COLORS.white },
  black: { value: BASE_COLORS.black },
  transparent: { value: BASE_COLORS.transparent },
} as const;

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
    DEFAULT: { value: { base: BASE_COLORS.text, _dark: 'oklch(93% 0 0)' } },
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
    inverted: { value: { base: BASE_COLORS.text, _dark: 'oklch(90% 0 0)' } },
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
