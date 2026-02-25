/**
 * Breakpoint values (numeric pixels).
 *
 * We follow the Radix UI breakpoint scale.
 *
 * Reference values (not active):
 *
 *   Tailwind CSS  xs:   0  sm: 640  md: 768  lg: 1024  xl: 1280  2xl: 1536
 *   Radix UI      xs:   0  sm: 520  md: 768  lg: 1024  xl: 1280  2xl: 1640  ← active
 *
 * @see https://www.radix-ui.com/themes/docs/theme/breakpoints
 *
 * NOTE: xs:0 is included for completeness but is rarely queried directly —
 * mobile-first design starts from zero by default. Each subsequent breakpoint
 * begins an override range. MIN-WIDTH queries are recommended.
 */

import type { ScreenClass } from './viewport.types';
import { toEmNumeric, toPixelString, toRemNumeric } from './viewport.utils';

// ============================================================================
// PRIMARY BREAKPOINTS (numeric px)
// ============================================================================

export const BREAKPOINTS: Record<ScreenClass, number> = {
  'xs': 0,
  'sm': 520,
  'md': 768,
  'lg': 1024,
  'xl': 1280,
  '2xl': 1640,
} as const;

// ============================================================================
// DERIVED FORMATS
// ============================================================================

type BpRecord<T> = Record<ScreenClass, T>;

const mapBreakpoints = <T>(fn: (v: number) => T): BpRecord<T> =>
  Object.fromEntries(Object.entries(BREAKPOINTS).map(([k, v]) => [k, fn(v)])) as BpRecord<T>;

/** All breakpoint values excluding xs=0, useful for loop-based queries. */
export const BREAKPOINT_VALUES = Object.values(BREAKPOINTS).slice(1);

/** Pixel strings — e.g. `{ sm: '520px', ... }`. Used by Panda CSS config. */
export const BREAKPOINTS_PX = mapBreakpoints(toPixelString);

/** Rem values — e.g. `{ sm: 32.5, ... }`. */
export const BREAKPOINTS_REM = mapBreakpoints(toRemNumeric);

/** Em values — same scale as REM in this context. */
export const BREAKPOINTS_EM = mapBreakpoints(toEmNumeric);
