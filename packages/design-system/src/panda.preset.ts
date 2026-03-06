/**
 * 🐼 Panda CSS Preset — Design System
 *
 * This preset bundles ALL design tokens and component recipes into a single
 * importable config. Consuming apps use it like:
 *
 * ```ts
 * // panda.config.ts (in apps/client)
 * import { defineConfig } from '@pandacss/dev';
 * import { designSystemPreset } from '@workspace/design-system/panda.preset';
 *
 * export default defineConfig({
 *   presets: [designSystemPreset],
 *   // ... app-specific overrides
 * });
 * ```
 */

import { definePreset } from '@pandacss/dev';

import { badgeRecipe } from './recipes/badge.recipe';
import { buttonRecipe } from './recipes/button.recipe';
import { calloutRecipe } from './recipes/callout.recipe';
import { cardRecipe } from './recipes/card.recipe';
import { checkboxRecipe } from './recipes/checkbox.recipe';
import { dialogRecipe } from './recipes/dialog.recipe';
import { formFieldRecipe } from './recipes/form-field.recipe';
import { inputRecipe } from './recipes/input.recipe';
import { labelRecipe } from './recipes/label.recipe';
import { menuRecipe } from './recipes/menu.recipe';
import { popoverRecipe } from './recipes/popover.recipe';
import { selectRecipe } from './recipes/select.recipe';
import { switchRecipe } from './recipes/switch.recipe';
import { tableRecipe } from './recipes/table.recipe';
import { tabsRecipe } from './recipes/tabs.recipe';
import { textRecipe } from './recipes/text.recipe';
import { toastRecipe } from './recipes/toast.recipe';
import { tooltipRecipe } from './recipes/tooltip.recipe';
import { durationTokens, easingTokens, keyframes } from './tokens/animations.tokens';
import { colorTokens, semanticColorTokens } from './tokens/colors.tokens';
import { borderWidthTokens, radiiTokens, shadowTokens } from './tokens/decorative.tokens';
import { spacingTokens, zIndexTokens } from './tokens/spacing.tokens';
import {
  fontSizeTokens,
  fontTokens,
  fontWeightTokens,
  lineHeightTokens,
  textStyles,
} from './tokens/typography.tokens';
import { BREAKPOINTS_PX } from './viewport/viewport.breakpoints';

export const designSystemPreset = definePreset({
  name: '@workspace/design-system',

  theme: {
    tokens: {
      colors: colorTokens,
      fonts: fontTokens,
      fontSizes: fontSizeTokens,
      fontWeights: fontWeightTokens,
      lineHeights: lineHeightTokens,
      spacing: spacingTokens,
      radii: radiiTokens,
      borderWidths: borderWidthTokens,
      shadows: shadowTokens,
      zIndex: zIndexTokens,
      durations: durationTokens,
      easings: easingTokens,
    },

    semanticTokens: {
      colors: semanticColorTokens,
      shadows: {
        sm: {
          value: { base: '{shadows.base.sm}', _dark: '0 1px 2px 0 rgba(0, 0, 0, 0.3)' },
        },
        md: {
          value: {
            base: '{shadows.base.md}',
            _dark: '0 4px 8px -2px rgba(0, 0, 0, 0.4), 0 1.5px 4px rgba(0, 0, 0, 0.3)',
          },
        },
        lg: {
          value: {
            base: '{shadows.base.lg}',
            _dark: '0 8px 24px rgba(0, 0, 0, 0.5), 0 1.5px 4px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },

    textStyles,

    extend: {
      keyframes,

      recipes: {
        button: buttonRecipe,
        badge: badgeRecipe,
        card: cardRecipe,
        callout: calloutRecipe,
        input: inputRecipe,
        label: labelRecipe,
        dsSwitch: switchRecipe,
        text: textRecipe,
      },

      slotRecipes: {
        checkbox: checkboxRecipe,
        dialog: dialogRecipe,
        formField: formFieldRecipe,
        menu: menuRecipe,
        popover: popoverRecipe,
        select: selectRecipe,
        table: tableRecipe,
        tabs: tabsRecipe,
        toast: toastRecipe,
        tooltip: tooltipRecipe,
      },

      breakpoints: BREAKPOINTS_PX,
    },
  },

  // Global CSS applied to every page using this design system
  globalCss: {
    '*, *::before, *::after': {
      boxSizing: 'border-box',
    },
    'html': {
      lineHeight: '1.5',
      WebkitTextSizeAdjust: '100%',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
      touchAction: 'manipulation',
      fontFamily: 'sans',
    },
    'body': {
      minHeight: '100dvh',
      position: 'relative',
      bg: 'bg',
      color: 'fg',
    },
    'img, svg, video, canvas, audio, iframe, embed, object': {
      display: 'block',
      verticalAlign: 'middle',
    },
    'img, video': {
      maxWidth: '100%',
      height: 'auto',
    },

    // ── SVG defaults ──────────────────────────────────────────────────────────
    'svg': {
      flexShrink: 0,
    },

    // ── Icon normalization (.icon class applied to all DS icon exports) ────────
    // Base: 2rem default, currentColor, color/border/bg transitions
    'svg.icon': {
      width: '2rem',
      height: '2rem',
      display: 'inline-block',
      flexShrink: 0,
      color: 'currentColor',
      transition:
        'color 200ms ease-in-out, border-color 200ms ease-in-out, background-color 200ms ease-in-out',
    },

    // Size variants
    'svg.icon.icon-sm': { width: '0.875rem', height: '0.875rem' },
    'svg.icon.icon-md': { width: '1rem', height: '1rem' },
    'svg.icon.icon-lg': { width: '1.25rem', height: '1.25rem' },
    'svg.icon.icon-xl': { width: '1.5rem', height: '1.5rem' },

    // Contextual — scales with surrounding text size
    'svg.icon.icon-contextual': { width: '1em', height: '1em' },

    // Loading spin
    'svg.icon.icon-loading': { animation: 'spin 1s linear infinite' },

    // Button context — hover scale / disabled fade
    '.button:hover svg.icon': { transform: 'scale(1.05)' },
    '.button:disabled svg.icon': { opacity: 0.5, transform: 'none' },

    // ── Text selection ────────────────────────────────────────────────────────
    '::selection': {
      bg: 'accent.muted',
      color: 'fg',
    },

    // ── Focus visible (global fallback — components override individually) ────
    ':focus-visible': {
      outline: '2px solid',
      outlineColor: 'accent.focusRing',
      outlineOffset: '2px',
    },

    // ── Scrollbar (webkit) ────────────────────────────────────────────────────
    // Thin custom scrollbars for overflow containers.
    // Body/html scrollbars are intentionally excluded (browser default is fine).
    ':not(body):not(html)::-webkit-scrollbar': {
      width: '6px',
      height: '6px',
    },
    ':not(body):not(html)::-webkit-scrollbar-track': {
      bg: 'bg.subtle',
      borderRadius: 'sm',
    },
    ':not(body):not(html)::-webkit-scrollbar-thumb': {
      bg: 'border',
      borderRadius: 'sm',
      border: '1px solid transparent',
      backgroundClip: 'content-box',
    },
    ':not(body):not(html)::-webkit-scrollbar-thumb:hover': {
      bg: 'fg.subtle',
    },
    ':not(body):not(html)::-webkit-scrollbar-corner': {
      bg: 'bg.subtle',
    },
  },
});
