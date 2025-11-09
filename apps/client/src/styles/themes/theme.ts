import { baseLayout } from '../constants/base.constants';
import { fontFamilies, fontSizes, fontWeights, lineHeights, typography } from '../fonts/typography.contants';
import { BREAKPOINTS } from 'styles/viewport/viewport.breakpoints';
import { colors } from '../colors/colors-direct';

export const theme = {
  colors,
  spacing: baseLayout.spacing,
  BREAKPOINTS,
  typography,
  fonts: fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
} as const;

export type Theme = typeof theme;
