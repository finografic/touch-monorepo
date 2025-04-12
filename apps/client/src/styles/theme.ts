import { colors } from './colors.styles';
import { spacing } from './global.constants';
import { BREAKPOINTS } from 'styles/viewport/viewport.breakpoints';
import { fontFamilies, fontSizes, fontWeights, lineHeights, typography } from './typography.styles';

export const theme = {
  colors,
  spacing,
  BREAKPOINTS,
  typography,
  fonts: fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
} as const;

export type Theme = typeof theme;
