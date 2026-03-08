import { BREAKPOINTS } from '@workspace/design-system/tokens';

import { colors } from '../colors/colors-direct';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  typography,
} from '../constants/typography.contants';
import { spacing } from '../layout/base.constants';

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
