import type { BreakpointMap } from 'styles/viewport/viewport.types';
import {
  mapNewBreakpointRules,
  toEmNumeric,
  toPixelString,
  toRemNumeric,
} from 'styles/viewport/viewport.utils';

// BREAKPOINT DEFAULT pixel values (from Carbon) best defined NUMERICALLY,
// allowing for calculations etc..

// NOTE: breakpoints - radix-ui
// https://www.radix-ui.com/themes/docs/theme/breakpoints
export const BREAKPOINTS_RADIX: BreakpointMap<number> = {
  xs: 0,
  sm: 520,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1640,
} as const;

// NOTE: breakpoints - tailwindcss
export const BREAKPOINTS_TW: BreakpointMap<number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
} as const;

export const BREAKPOINTS = BREAKPOINTS_RADIX;
export const BREAKPOINT_VALUES = Object.values(BREAKPOINTS).slice(1);

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
