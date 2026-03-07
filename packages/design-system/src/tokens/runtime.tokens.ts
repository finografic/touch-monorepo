/**
 * @file runtime.tokens.ts
 *
 * CSS-in-JS runtime values for use in Emotion `css`` ` templates.
 *
 * Exports only two objects consumed by `*.styles.ts` files:
 *   - `colors` — full color palette (camelCase → CSS custom property strings)
 *   - `layout`  — core layout defaults (spacing, radii, structural dimensions)
 *
 * For Panda CSS / static design tokens, import directly from the specific
 * token files (e.g. `spacingTokens`, `fontSizeTokens`) instead.
 */

import { colors } from '../palette/colors.palette';
import { borderWidthTokens, radiiTokens } from './decorative.tokens';
import { layoutTokens } from './layout.tokens';
import { spacingTokens } from './spacing.tokens';
import { textStyles } from './typography.tokens';

// Internal — not exported. Used only to build `layout` below.
const _border = {
  width: {
    default: borderWidthTokens['default'].value, // 2px
  },
  radius: {
    xs: radiiTokens['xs'].value,
    sm: radiiTokens['sm'].value,
    md: radiiTokens['md'].value,
  },
} as const;

export const layout = {
  fontSize: textStyles.body.md.value.fontSize,
  padding: spacingTokens['4'].value, // 1rem
  borderWidth: _border.width.default, // 2px
  borderRadius: _border.radius.md, // 1rem
  pageColor: colors.white,
  bgColor: colors.white,
  radius: _border.radius.sm,
  radiusInner: _border.radius.xs,
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

export { colors };
