export { colors } from './colors/colors-direct'; // ✅ OKLCH values (perceptually uniform!)
// 🎨 OKLCH themes - now the default! (better perceptual uniformity)
export { darkTheme, lightTheme, themes } from './colors/colors-direct'; // Re-exported OKLCH themes
// 🔧 Legacy exports - for backwards compatibility (if you need hex values)
export { colors as colorsDirect } from './colors/colors-direct'; // Alias (same as colors)
// 🎨 Color exports - OKLCH COLOR SPACE (default - recommended!)
export type { ColorBaseName, ColorName, HexColor } from './colors/colors.types';
export type { ColorPalette } from './colors/palette.types';
export { withOpacity } from './colors/utils/colors.utils';

// 📐 Layout & spacing
export { button } from './constants/button.constants';
export { border, spacing } from './constants/global.constants';
export { cssBorder, layout } from './constants/global.constants';

// 📝 Typography
export { typography } from './constants/typography.constants';
export { fontFamilies, fontSizes, fontWeights, lineHeights } from './fonts/typography.contants';
// 🌐 Global styles
export { cssGlobal } from './global.styles';
// 🎯 Zero-migration hooks - use these for easiest transition!
export { useColors, useThemeName } from './hooks/useColors';
export type { EmotionTheme } from './themes/emotion-theme.types';
export {
  darkTheme as hexDarkTheme,
  lightTheme as hexLightTheme,
  themes as hexThemes,
} from './themes/generate-emotion-themes'; // Hex-based themes
export { oklchDarkTheme, oklchLightTheme, oklchThemes } from './themes/generate-oklch-themes'; // Explicit OKLCH aliases

// 🎨 Color utilities
export type { ColorVariants, UiColorVariants } from './utils/generate-ui-color-variants.utils';
export {
  generateComponentColorVariants,
  generateUiColorVariants,
} from './utils/generate-ui-color-variants.utils';

// 📱 Viewport
export { BREAKPOINTS } from './viewport/viewport.breakpoints';
export { max, min, sizes } from './viewport/viewport.queries';
