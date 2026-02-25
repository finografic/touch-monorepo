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

import { durationTokens, easingTokens, keyframes } from './tokens/animations.tokens';
import { colorTokens, semanticColorTokens } from './tokens/colors.tokens';
import {
  borderWidthTokens,
  breakpoints,
  radiiTokens,
  shadowTokens,
  spacingTokens,
  zIndexTokens,
} from './tokens/spacing.tokens';
import {
  fontSizeTokens,
  fontTokens,
  fontWeightTokens,
  lineHeightTokens,
  textStyles,
} from './tokens/typography.tokens';
import { buttonRecipe } from './recipes/button';
import { badgeRecipe } from './recipes/badge';
import { calloutRecipe } from './recipes/callout';
import { inputRecipe } from './recipes/input';
import { switchRecipe } from './recipes/switch';

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
          value: { base: '{shadows.sm}', _dark: '0 1px 2px 0 rgba(0, 0, 0, 0.3)' },
        },
        md: {
          value: {
            base: '{shadows.md}',
            _dark: '0 4px 8px -2px rgba(0, 0, 0, 0.4), 0 1.5px 4px rgba(0, 0, 0, 0.3)',
          },
        },
        lg: {
          value: {
            base: '{shadows.lg}',
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
        callout: calloutRecipe,
        input: inputRecipe,
        switch: switchRecipe,
      },

      breakpoints,
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
  },
});
