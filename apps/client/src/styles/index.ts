// 🎨 Color exports - OKLCH COLOR SPACE (recommended - default export)
export { colors } from './colors/colors-direct'; // ✅ OKLCH values (perceptually uniform!)
export type { ColorBaseName, ColorName, HexColor } from './colors/colors.types';
export type { ColorPalette } from './colors/palette.types';

// 🎨 OKLCH themes - now the default! (better perceptual uniformity)
export { lightTheme, darkTheme, themes } from './colors/colors-direct'; // Re-exported OKLCH themes
export type { EmotionTheme } from './themes/emotion-theme.types';

// 🔧 Legacy exports - for backwards compatibility only
export { colors as colorsCSS } from './colors/colors.styles'; // ⚠️ CSS variables
export { colors as colorsDirect } from './colors/colors-direct'; // Alias
export { lightTheme as hexLightTheme, darkTheme as hexDarkTheme, themes as hexThemes } from './themes/generate-emotion-themes'; // Hex-based
export { oklchLightTheme, oklchDarkTheme, oklchThemes } from './themes/generate-oklch-themes'; // Explicit OKLCH

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
