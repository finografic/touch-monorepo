// 🎨 Color exports
export { colors } from './colors/colors.styles'; // Legacy: CSS variable references
export type { ColorBaseName, ColorName, HexColor } from './colors/colors.types';
export type { ColorPalette } from './colors/palette.types';

// 🚀 Performance exports - direct values (recommended)
export { colors as colorsDirect } from './colors/colors-direct';
export { lightTheme, darkTheme, themes } from './themes/generate-emotion-themes';
export type { EmotionTheme } from './themes/emotion-theme.types';

// 🎨 OKLCH color space themes - better perceptual uniformity
export { oklchLightTheme, oklchDarkTheme, oklchThemes } from './themes/generate-oklch-themes';

// 🎯 Zero-migration hooks - use these for easiest transition!
export { useColors, useThemeName } from './hooks/useColors';

// 📐 Layout & spacing
export { spacing } from './constants/global.constants';
export { border, button, layout } from './constants/global.constants';

// 📝 Typography
export { fontFamilies, fontSizes, fontWeights, lineHeights, typography } from './fonts/typography.contants';

// 🌐 Global styles
export { cssGlobal } from './global.styles';

// 🎨 Color utilities
export type { ColorVariants, UiColorVariants } from './utils/generate-ui-color-variants.utils';
export {
  generateComponentColorVariants,
  generateUiColorVariants,
} from './utils/generate-ui-color-variants.utils';

// 📱 Viewport
export { BREAKPOINTS } from './viewport/viewport.breakpoints';
export { max, min, sizes } from './viewport/viewport.queries';
