/**
 * @file _migration.tokens.ts
 *
 * Temporary compatibility shim — bridges the client's local `styles/` imports
 * to the design system while the migration is in progress.
 *
 * All exports here map to `import { ... } from '@workspace/design-system/tokens'`
 * in client `*.styles.ts` files. They exist to make the migration incremental:
 * client files can update their import path without needing to change usage at
 * the same time.
 *
 * ---
 *
 * ## Export status
 *
 * | Export    | Files | Status    | End state                                      |
 * | --------- | ----- | --------- | ---------------------------------------------- |
 * | `colors`  | 95    | KEEP ✓    | Move re-export to `tokens/index.ts` directly   |
 * | `layout`  | 36    | KEEP ✓    | Move definition to `layout.tokens.ts`          |
 * | `spacing` | 10    | PHASE OUT | Replace with Panda utilities / direct values   |
 * | `button`  | 11    | PHASE OUT | Replace with DS Button recipe                  |
 * | `border`  | 3     | PHASE OUT | Replace with Panda utilities / direct values   |
 *
 * ---
 *
 * ## Deletion plan
 *
 * This file is deleted when:
 *   1. `spacing`, `button`, `border` are no longer imported by any client file
 *   2. `layout` definition is moved to `layout.tokens.ts`
 *   3. `colors` re-export is moved to `tokens/index.ts` (from palette directly)
 *   4. `tokens/index.ts` is updated to remove the import of this file
 *
 * Track progress by grepping client imports:
 *   rg "from 'styles'" apps/client/src
 *   rg "from '@workspace/design-system/tokens'" apps/client/src
 */

import { colors } from '../palette/colors.palette';
import { borderWidthTokens, radiiTokens } from './decorative.tokens';
import { layoutTokens } from './layout.tokens';
import { spacingTokens } from './spacing.tokens';
import { textStyles } from './typography.tokens';

// PHASE OUT — replace usages with Panda spacing utilities or direct CSS values.
// When no client file imports `spacing`, delete this block.
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

// PHASE OUT — replace usages with Panda utilities or inline values.
// When no client file imports `border`, delete this block.
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

// PHASE OUT — replace usages with the DS Button component and its recipe props.
// When no client file imports `button`, delete this block.
export const button = {
  background: colors.defaultXXLight,
  border: {
    width: '2px',
    style: 'solid',
  },
  color: {
    default: colors.defaultXLight,
    hover: colors.default,
    active: colors.secondaryXLight,
    disabled: colors.defaultXLight,
  },
  hover: {
    color: colors.default,
    border: colors.default,
    background: colors.defaultXXLight,
  },
  md: {
    minWidth: '200px',
    minHeight: '60px',
  },
  radius: border.radius.sm,
  transform: {
    hoverScale: 1.025,
    padHoverScale: 1.05,
    padBasicHoverScale: 1.02,
  },
  transition: 'transform 200ms ease, border-color 200ms ease, color 200ms ease',
  disabled: {
    opacity: 0.55, // TODO: DEV VALUE (HIGH) FOR LIGHT MODE.. MAKE VALUE LIGHTER IF NEEDED
  },
  padding: {
    base: '0.8rem',
    small: '0.4rem',
    large: '1rem',
  },
  fontSize: {
    base: '1.4rem',
    small: '1.2rem',
    large: '1.8rem',
  },
  fontWeight: {
    base: '600',
    small: '600',
    large: '600',
  },
} as const;

// KEEP — move this definition to layout.tokens.ts when migration is complete,
// then delete this block and update tokens/index.ts to re-export from there.
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

// KEEP — move this re-export to tokens/index.ts directly (from palette/colors.palette)
// when migration is complete, then delete this line.
export { colors };
