import { definePreset } from '@pandacss/dev';

import { durationTokens, easingTokens, keyframes } from './tokens/animations.tokens';
import { colorTokens, semanticColorTokens } from './tokens/colors.tokens';
import { borderWidthTokens, radiiTokens, shadowTokens } from './tokens/decorative.tokens';
import { sizingTokens } from './tokens/sizes.tokens';
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
      sizes: sizingTokens,
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

      breakpoints: BREAKPOINTS_PX,
    },
  },

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

    'svg': {
      flexShrink: 0,
    },

    'svg.icon': {
      width: '2rem',
      height: '2rem',
      display: 'inline-block',
      flexShrink: 0,
      color: 'currentColor',
      transition:
        'color 200ms ease-in-out, border-color 200ms ease-in-out, background-color 200ms ease-in-out',
    },

    'svg.icon.icon-sm': { width: '0.875rem', height: '0.875rem' },
    'svg.icon.icon-md': { width: '1rem', height: '1rem' },
    'svg.icon.icon-lg': { width: '1.25rem', height: '1.25rem' },
    'svg.icon.icon-xl': { width: '1.5rem', height: '1.5rem' },

    'svg.icon.icon-contextual': { width: '1em', height: '1em' },
    'svg.icon.icon-loading': { animation: 'spin 1s linear infinite' },

    '.button:hover svg.icon': { transform: 'scale(1.05)' },
    '.button:disabled svg.icon': { opacity: 0.5, transform: 'none' },

    '::selection': {
      bg: 'accent.muted',
      color: 'fg',
    },

    ':focus-visible': {
      outline: '2px solid',
      outlineColor: 'accent.focusRing',
      outlineOffset: '2px',
    },

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
