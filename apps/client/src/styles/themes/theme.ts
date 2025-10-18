import { BREAKPOINTS } from 'styles/viewport/viewport.breakpoints';
import { spacing } from '../constants/global.constants';
import { fontFamilies, fontSizes, fontWeights, lineHeights, typography } from '../fonts/typography.contants';
import { colors } from '../colors/colors.styles';

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
