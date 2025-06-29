import type { BreakpointMap } from 'styles/viewport/viewport.types';
import { BREAKPOINTS } from 'styles/viewport/viewport.breakpoints';

// Default pixel size of the HTML DOM object
// used to calculate REM, and indirectly EM units
const BASE_PX = 16;

// CONVERSION UTILS:
export const convertPxToRem = (px: number): number => {
  const remSize = Number(((1 / BASE_PX) * px).toFixed(2));

  return remSize;
};

export const convertRemToPx = (rem: number): number => {
  const pxSize = Number(rem / (1 / BASE_PX));

  return pxSize;
};

// MAIN BREAKPOINT MAPPING UTILITY:
// generate various rules/criteria mapped to the breakpoint sizes,
// using helper functions below.
export const mapNewBreakpointRules = (
  toNewValueType: (value: number) => string | number,
): Partial<BreakpointMap<number>> => {
  return Object.fromEntries(
    Object.entries(BREAKPOINTS).map(([size, value]) => [size, toNewValueType(value as number)]),
  );
};

// The following methods serve as the argument pass to mapNewBreakpointRules()
// determining what is mapped to each key, using the default breakpoint values.
const toPixelString = (value: number) => `${value}px`;
const toRemNumeric = (px: number) => convertPxToRem(px);
const toEmNumeric = (px: number) => convertPxToRem(px); // this case:  EM = REM

/**
 * NOTE: For media-queries, there are many opinions on which unit to use:
 * PX vs REM vs EM.. Overall, PX and EM seem to be most recommended,
 * but will be using PX here, as it also follows Carbon.
 *
 * Great trial-based explanation found here (link) for using EM, performing best
 * accross-browsers, for accessibility, user zooming, and font change.
 * https://betterprogramming.pub/px-em-or-rem-examining-media-query-units-in-2021-e00cf37b91a9
 */

const toMediaMinWidth = (value: number) => `(min-width: ${value}px)`;
const toMediaMaxWidth = (value: number) => `(max-width: ${value}px)`;

export { toPixelString, toRemNumeric, toEmNumeric, toMediaMinWidth, toMediaMaxWidth };
