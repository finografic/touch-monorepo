/**
 * Palette type definitions
 * Defines the structure and types for the generated OKLCH color palette
 *
 * All colors are now direct OKLCH values (no CSS variables) for better performance.
 * See MIGRATION_GUIDE.md and OKLCH_GUIDE.md for more details.
 */
import type {
  ColorBaseName,
  ColorNameNoShadeVariant,
  ColorValue,
  ShadeVariant,
  TransparencyLevel,
} from './colors.types';

// ======================================================================== //
// COLOR PALETTE TYPE
// ======================================================================== //

/**
 * Colors that have shade variants (excludes background which is fixed)
 */
type ColorWithShades = Exclude<ColorBaseName, 'background'>;

/**
 * Color palette type - FULLY TYPED with autocomplete support! 🎯
 *
 * Structure:
 * - Base colors with shades: primary, primaryXXLight, primaryXLight, primaryLight, primaryDark, primaryXDark, primaryXXDark
 * - Transparency variants: primary25, primary50, primary75
 * - Shade + transparency: primaryXXLight25, primaryXXLight50, etc.
 * - Special: white/black (only transparency), transparent/background (no variants)
 *
 * Example autocomplete:
 * - colors.primary ✅
 * - colors.primaryLight ✅
 * - colors.primaryDark50 ✅
 * - colors.white25 ✅
 * - colors.whiteDark ❌ (white has no shades)
 * - colors.backgroundLight ❌ (background has no shades)
 */
export type ColorPalette =
  // Base colors with shade variants (primary, secondary, success, etc. - NOT background)
  {
    [K in ColorWithShades]: ColorValue;
  } & {
    // Shade variants (e.g., primaryXXLight, primaryLight, primaryDark)
    [K in ColorWithShades as `${K}${ShadeVariant}`]: ColorValue;
  } & {
    // Base transparency variants (e.g., primary25, primary50, primary75)
    [K in ColorWithShades as `${K}${TransparencyLevel}`]: ColorValue;
  } & {
    // Shade + transparency variants (e.g., primaryXXLight25, primaryDark50)
    [K in ColorWithShades as `${K}${ShadeVariant}${TransparencyLevel}`]: ColorValue;
  } & {
    // White and black: ONLY transparency variants (no shades)
    [K in ColorNameNoShadeVariant]: ColorValue;
  } & {
    [K in ColorNameNoShadeVariant as `${K}${TransparencyLevel}`]: ColorValue;
  } & {
    // Special colors: transparent (no variants), background (no variants - fixed value)
    transparent: 'transparent';
    background: ColorValue;
  };
