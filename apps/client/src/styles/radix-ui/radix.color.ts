import * as radix from '@radix-ui/colors';
import type { HexColor } from '../colors.types';
import { RadixColorName, RadixShade } from './radix.types';

// Helper to ensure number is a valid RadixShade
export const toRadixShade = (num: number): RadixShade => {
  return Math.max(1, Math.min(12, num)) as RadixShade;
};

// Helper to get hex value from Radix colors
export const getRadixHex = (color: RadixColorName, shade: RadixShade): HexColor => {
  const key = `${color}${shade}`;
  return radix[color][key as keyof (typeof radix)[RadixColorName]] as HexColor;
};
