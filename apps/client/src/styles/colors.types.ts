/**
 * Basic color type definitions and hex color validation
 */
import type { ColorBaseName, ColorPalette } from './palette.types';
import type { RadixColorName, RadixColorVariable } from './radix-ui/radix.types';

// Union type for possible color values
export type ColorValue = RadixColorVariable | HexColor | `var(--color-${string})` | 'transparent';

// Valid base shades (allowing +/- 3 for variants)
export type RadixBaseShade = 4 | 5 | 6 | 7 | 8 | 9;

// Type for the color mapping structure
export type ColorMapping = {
  [K in ColorBaseName]:
    | {
        color: RadixColorName;
        shade: RadixBaseShade;
      }
    | {
        value: HexColor | string; // Allow both HexColor and Tailwind OKLCH strings
      };
};

/**
 * Type for any valid color name in the palette
 */
export type ColorName = keyof ColorPalette;

// ======================================================================== //

/**
 * Basic color type definitions and hex color validation
 */
export type HexColor = Lowercase<`#${HexChar}${string}`> | Uppercase<`#${HexChar}${string}`> | 'transparent';
type HexChar = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f';

/**
 * Shade suffixes in PascalCase (used in color variant names)
 */
export type ShadeSuffix = 'XXLight' | 'XLight' | 'Light' | 'Dark' | 'XDark' | 'XXDark';

/**
 * Shade keys in lowercase (used in configuration and mapping)
 * Note: 'base' is handled specially and doesn't have a suffix
 */
export type ShadeKey = Lowercase<ShadeSuffix> | 'base';
