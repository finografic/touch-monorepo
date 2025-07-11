import * as radix from '@radix-ui/colors';
import type { ColorMapping, HexColor } from './colors.types';
import { generateRadixColorPalette } from './radix-ui/radix.palette';

/**
 * Radix color mapping with VS Code highlighting support
 * Format: { colorKey: { color: RadixColorName, shade: RadixShade } }
 */

export const COLOR_MAPPING: ColorMapping = {
  // main colors
  primary: { color: 'blue', shade: 9 },
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
  // base colors
  white: { value: '#FFFFFF' as HexColor },
  black: { value: '#000000' as HexColor },
  transparent: { value: 'transparent' as HexColor },
} as const;

// TODO: radix or custom ??
export const colorsRadix = generateRadixColorPalette(COLOR_MAPPING);
export { colors } from './custom/custom.colors';
