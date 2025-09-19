import { css } from '@emotion/react';

export const fontFamilies = {
  system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
} as const;

export const fontSizes = {
  base: '1rem', // NOTE: BASE SIZE
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem', // NOTE: BASE SIZE
  lg: '1.125rem',
  xl: '1.25rem',
  xxl: '1.5rem',
  xxxl: '1.875rem',
} as const;

export const fontWeights = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

export const typography = {
  h1: css`
    font-size: ${fontSizes.xxxl};
    font-weight: ${fontWeights.bold};
    line-height: ${lineHeights.tight};
  `,
  h2: css`
    font-size: ${fontSizes.xxl};
    font-weight: ${fontWeights.bold};
    line-height: ${lineHeights.tight};
  `,
  h3: css`
    font-size: ${fontSizes.xl};
    font-weight: ${fontWeights.semibold};
    line-height: ${lineHeights.snug};
  `,
  body: css`
    font-size: ${fontSizes.md};
    line-height: ${lineHeights.normal};
  `,
  caption: css`
    font-size: ${fontSizes.xs};
    line-height: ${lineHeights.normal};
  `,
};
