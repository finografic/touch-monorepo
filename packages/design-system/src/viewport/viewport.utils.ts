// Default pixel size of the HTML root element, used for rem/em conversions.
const BASE_PX = 16;

// ============================================================================
// CONVERSION UTILS
// ============================================================================

export const convertPxToRem = (px: number): number =>
  Number(((1 / BASE_PX) * px).toFixed(2));

export const convertRemToPx = (rem: number): number =>
  Number(rem / (1 / BASE_PX));

// ============================================================================
// VALUE FORMATTERS
// Used as callbacks to mapBreakpoints() in viewport.breakpoints.ts
// ============================================================================

export const toPixelString = (value: number): string => `${value}px`;
export const toRemNumeric = (px: number): number => convertPxToRem(px);
export const toEmNumeric = (px: number): number => convertPxToRem(px); // EM = REM in this context

/**
 * NOTE: For media queries, PX and EM are most recommended.
 * PX is used here for simplicity and Carbon/Radix compatibility.
 * See: https://betterprogramming.pub/px-em-or-rem-examining-media-query-units-in-2021-e00cf37b91a9
 */
export const toMediaMinWidth = (value: number): string => `(min-width: ${value}px)`;
export const toMediaMaxWidth = (value: number): string => `(max-width: ${value}px)`;
