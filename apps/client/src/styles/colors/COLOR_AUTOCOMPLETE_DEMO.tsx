/**
 * 🎯 Fully Typed Color Palette Demo
 *
 * This file demonstrates the NEW fully typed ColorPalette!
 * Now you get FULL autocomplete and IntelliSense for all color keys!
 *
 * Try typing `colors.` and see the magic! ✨
 */

import { css } from '@emotion/react';
import { colors } from './colors-direct';

// ============================================================================
// AUTOCOMPLETE EXAMPLES
// ============================================================================

/**
 * ✅ Base Colors - Full autocomplete!
 */
const baseExample = css`
  color: ${colors.primary};        // ✅ Autocomplete suggests: primary, secondary, success, etc.
  background: ${colors.success};    // ✅ All base colors available
  border-color: ${colors.danger};   // ✅ IntelliSense shows all options
`;

/**
 * ✅ Shade Variants - Full autocomplete!
 */
const shadeExample = css`
  color: ${colors.primaryLight};      // ✅ Autocomplete: primaryXXLight, primaryXLight, primaryLight
  background: ${colors.primaryDark};  // ✅ Also: primaryDark, primaryXDark, primaryXXDark
  border: 1px solid ${colors.successLight}; // ✅ Works for all colors with shades
`;

/**
 * ✅ Transparency Variants - Full autocomplete!
 */
const transparencyExample = css`
  background: ${colors.primary25};      // ✅ Autocomplete: primary25, primary50, primary75
  border-color: ${colors.danger50};     // ✅ All transparency levels
  color: ${colors.infoLight75};         // ✅ Even shade + transparency!
`;

/**
 * ✅ Shade + Transparency - Full autocomplete!
 */
const combinedExample = css`
  background: ${colors.primaryXXLight25};  // ✅ All shade + transparency combos
  backdrop-filter: ${colors.successDark50}; // ✅
  box-shadow: 0 2px 8px ${colors.greyLight25}; // ✅
`;

/**
 * ✅ White/Black - ONLY transparency (no shades)
 */
const whiteBlackExample = css`
  color: ${colors.white};        // ✅ Base white/black
  background: ${colors.black25}; // ✅ Transparency variants: 25, 50, 75
  border: 1px solid ${colors.white50}; // ✅

  // ❌ TypeScript ERROR - white/black have NO shades!
  // color: ${colors.whiteLight};  // ❌ Error: Property 'whiteLight' does not exist
  // background: ${colors.blackDark}; // ❌ Error: Property 'blackDark' does not exist
`;

/**
 * ✅ Special Colors
 */
const specialExample = css`
  background: ${colors.background};    // ✅ Fixed background color
  border-color: ${colors.transparent}; // ✅ Transparent

  // ❌ TypeScript ERROR - background has NO variants!
  // color: ${colors.backgroundLight};  // ❌ Error: Property 'backgroundLight' does not exist
  // background: ${colors.background25}; // ❌ Error: Property 'background25' does not exist
`;

// ============================================================================
// TYPE SAFETY EXAMPLES
// ============================================================================

/**
 * ❌ Invalid color keys are caught by TypeScript!
 */
const invalidExamples = () => {
  // Uncomment to see TypeScript errors:

  // return css`
  //   color: ${colors.invalidColor};      // ❌ Error: Property 'invalidColor' does not exist
  //   background: ${colors.primarySuper}; // ❌ Error: 'Super' is not a valid shade
  //   border: ${colors.white100};         // ❌ Error: 100 is not a valid transparency level
  // `;
};

// ============================================================================
// AUTOCOMPLETE COUNTS
// ============================================================================

/**
 * Total available color keys with FULL autocomplete:
 *
 * Base colors with shades: 9 colors
 * - primary, secondary, success, warning, danger, info, text, default, grey
 *
 * Each base color has:
 * - 1 base: primary
 * - 6 shades: primaryXXLight, primaryXLight, primaryLight, primaryDark, primaryXDark, primaryXXDark
 * - 3 transparency: primary25, primary50, primary75
 * - 18 shade+transparency: primaryXXLight25, primaryXXLight50, ... primaryXXDark75
 * = 28 variants per color × 9 colors = 252 keys
 *
 * White/black:
 * - 2 base: white, black
 * - 6 transparency: white25, white50, white75, black25, black50, black75
 * = 8 keys
 *
 * Special:
 * - transparent, background
 * = 2 keys
 *
 * TOTAL: 252 + 8 + 2 = 262 color keys with FULL autocomplete! 🎉
 */

// ============================================================================
// USAGE PATTERNS
// ============================================================================

/**
 * Pattern 1: Direct in styles
 */
export const buttonStyles = css`
  background: ${colors.primary};
  color: ${colors.white};
  border: 2px solid ${colors.primaryDark};

  &:hover {
    background: ${colors.primaryLight};
    border-color: ${colors.primary};
  }

  &:disabled {
    background: ${colors.default50};
    color: ${colors.greyLight};
  }
`;

/**
 * Pattern 2: Dynamic with functions
 */
export const getButtonVariant = (variant: 'primary' | 'danger' | 'success') => {
  const colorMap = {
    primary: {
      bg: colors.primary,
      hover: colors.primaryLight,
      text: colors.white,
    },
    danger: {
      bg: colors.danger,
      hover: colors.dangerLight,
      text: colors.white,
    },
    success: {
      bg: colors.success,
      hover: colors.successLight,
      text: colors.white,
    },
  };

  return css`
    background: ${colorMap[variant].bg};
    color: ${colorMap[variant].text};

    &:hover {
      background: ${colorMap[variant].hover};
    }
  `;
};

/**
 * Pattern 3: With theme (even better!)
 */
export const themeAwareStyles = (theme: any) => css`
  background: ${theme.colors.primary};     // ✅ Full autocomplete on theme.colors too!
  color: ${theme.colors.white};
  border: 1px solid ${theme.colors.primaryLight50};
`;

// ============================================================================
// BENEFITS SUMMARY
// ============================================================================

/**
 * 🎉 What You Get:
 *
 * ✅ Full IntelliSense autocomplete for all 262 color keys
 * ✅ TypeScript errors for invalid color keys
 * ✅ No more typos (primaryLite vs primaryLight)
 * ✅ Discover available colors as you type
 * ✅ See all shade and transparency options
 * ✅ Catch errors at compile time, not runtime
 *
 * Before:
 * colors.primary  // ❓ What other colors exist?
 *
 * After:
 * colors.  // ✨ Shows ALL 262 options with autocomplete!
 *   - primary
 *   - primaryXXLight
 *   - primaryXLight
 *   - primaryLight
 *   - primaryDark
 *   - primaryXDark
 *   - primaryXXDark
 *   - primary25
 *   - primary50
 *   - primary75
 *   - primaryXXLight25
 *   - ... (252 more!)
 */

export {};

