import { colors } from './colors.styles';
import { spacing } from './spacing';
import { BREAKPOINTS, mediaQueries } from './breakpoints';
import { fontFamilies, fontSizes, fontWeights, lineHeights, typography } from './typography.styles';

export const theme = {
  colors,
  spacing,
  BREAKPOINTS,
  mediaQueries,
  typography,
  fonts: fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
} as const;

export type Theme = typeof theme;
