import * as radix from '@radix-ui/colors';
import type { ColorMapping, HexColor } from './colors.types';
import { generateRadixColorPalette } from './radix-ui/radix.palette';

/**
 * Radix color mapping with VS Code highlighting support
 * Format: { colorKey: { color: RadixColorName, shade: RadixShade } }
 */

export const COLOR_MAPPING: Omit<ColorMapping, 'white' | 'black'> = {
  // main colors
  primary: { color: 'cyan', shade: 8 },
  secondary: { color: 'teal', shade: 8 },
  default: { color: 'gray', shade: 4 },
  // text + greys
  text: { color: 'slate', shade: 9 },
  background: { value: radix.slate.slate4 as HexColor },
  grey: { color: 'slate', shade: 8 },
  gray: { color: 'slate', shade: 8 },
  // status colors
  success: { color: 'grass', shade: 7 },
  warning: { color: 'amber', shade: 8 },
  danger: { color: 'red', shade: 8 },
  info: { color: 'blue', shade: 9 },
} as const;

// TODO: radix or custom ??
export const colorsRadix = generateRadixColorPalette(COLOR_MAPPING);
export { colors } from './custom/custom.colors';
