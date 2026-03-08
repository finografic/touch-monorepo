import { colors } from '../colors/colors-direct';
import { fontFamilies, fontSizes, fontWeights, lineHeights, typography } from '../constants/typography.contants';
import { spacing } from '../layout/base.constants';
import { BREAKPOINTS } from '@workspace/design-system/tokens';

// export interface ThemeValues {
//   colors: ColorPalette;
//   spacing: BaseLayout;
//   breakpoints: BreakpointMap<number>;
//   typography: Typography;
//   fonts: FontFamily;
//   fontSizes: FontSize;
//   fontWeights: FontWeight;
//   lineHeights: LineHeight;
// }

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

// export type Theme = typeof theme;
