import type { BreakpointMap } from 'styles/viewport/viewport.types';
import { mapNewBreakpointRules, toEmNumeric, toPixelString, toRemNumeric } from 'utils/utils.viewport';

// BREAKPOINT DEFAULT pixel values (from Carbon) best defined NUMERICALLY,
// allowing for calculations etc..

// NOTE: breakpoints from radix-ui
export const BREAKPOINTS: BreakpointMap<number> = {
  xs: 0, // (not really used)
  sm: 520,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1640,
} as const;

// Type to access either xxl or 2xl
export type TailwindBreakpoints = {
  'xs'?: number;
  'sm': number;
  'md': number;
  'lg': number;
  'xl': number;
  'xxl': number;
  '2xl': number;
};

/**
 * NOTE: xs:320 as a breakpoint is redundant, as the smallest range
 * that will be queried is actually 0-600px (starting from zero),
 * which is the XS "size", when thinking in terms of RANGES.
 *
 * Each subsequent "size" is then the range that begins with its named
 * breakpoint value and ends with the next breakpoint value.
 * (again, when thinking in ranges).
 * The final breakpoint: XL, begins a range where NO max is required.
 *
 * Mobile-first responsive design uses zero as the default size,
 * much like a boolean default is (should be) 'false';
 * then, in ascending order, each breakpoint begins a new override clause.
 * MIN-WIDTH media queries are therefore recommended for most use cases;
 * and they also allow avoiding the need to +/- 1px to the breakpoint value.
 */

export const BREAKPOINTS_PX = mapNewBreakpointRules(toPixelString);
export const BREAKPOINTS_REM = mapNewBreakpointRules(toRemNumeric);
export const BREAKPOINTS_EM = mapNewBreakpointRules(toEmNumeric);
