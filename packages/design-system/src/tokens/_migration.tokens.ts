import { colors } from './colors.palette';
import { layoutTokens } from './layout.tokens';
import { borderWidthTokens, radiiTokens, spacingTokens } from './spacing.tokens';
import { textStyles } from './typography.tokens';

export const spacing = {
  none: spacingTokens['0'].value,
  px: spacingTokens['px'].value,
  xs: spacingTokens['1'].value,
  sm: spacingTokens['2'].value,
  md: spacingTokens['3'].value,
  default: spacingTokens['4'].value,
  lg: spacingTokens['5'].value,
  xl: spacingTokens['6'].value,
  xxl: spacingTokens['7'].value,
  xxxl: spacingTokens['8'].value,
  xxxxl: spacingTokens['9'].value,
} as const;

export const border = {
  width: {
   none: borderWidthTokens['none'].value,
   light: borderWidthTokens['light'].value,
   default: borderWidthTokens['default'].value,
   heavy: borderWidthTokens['heavy'].value,
  },
  radius: {
    none: radiiTokens['none'].value,
    xs: radiiTokens['xs'].value,
    sm: radiiTokens['sm'].value,
    md: radiiTokens['md'].value,
    lg: radiiTokens['lg'].value,
    xl: radiiTokens['xl'].value,
    xxl: radiiTokens['2xl'].value,
    full: radiiTokens['full'].value,
  },
} as const;

// NOTE: LAYOUT [DEFAULT VALUES]

export const layout = {
  fontSize: textStyles.body.md.value.fontSize,
  padding: spacingTokens['4'].value, // default 1rem
  borderWidth: border.width.default, // 2px
  borderRadius: border.radius.md, // 1rem
  pageColor: colors.white,
  bgColor: colors.white,
  radius: border.radius.sm,
  radiusInner: border.radius.xs,
  header: {
    height: layoutTokens.header.height,
  },
  footer: {
    height: layoutTokens.footer.height,
  },
  sidebar: {
    width: layoutTokens.sidebar.width,
  },
  navbar: {
    height: layoutTokens.navbar.height,
  },
  drawer: {
    bar: {
      height: layoutTokens.drawer.bar.height,
    },
  },
  imagePreview: {
    height: layoutTokens.imagePreview.height,
  },
} as const;

// ======================================================================== //

export { colors };
