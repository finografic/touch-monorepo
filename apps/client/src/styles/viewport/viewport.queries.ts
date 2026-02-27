import { BREAKPOINTS } from './viewport.breakpoints';
import type { BreakpointMap, MediaQueryMap, ScreenClass } from './viewport.types';
import { mapNewBreakpointRules, toMediaMaxWidth, toMediaMinWidth } from './viewport.utils';

// ======================================================================== //
// NOTE: V1 - FOR USE in TSX FILES..

export const MEDIA_QUERIES: MediaQueryMap = {
  min: mapNewBreakpointRules(toMediaMinWidth),
  max: mapNewBreakpointRules(toMediaMaxWidth),
};

export const QUERIES_MIN: Required<BreakpointMap<string>> = {
  xs: `(min-width: ${0}px)`,
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  xxl: `(min-width: ${BREAKPOINTS.xxl}px)`,
} as const;

export const QUERIES_MAX: Required<Omit<BreakpointMap<string>, 'xs'>> = {
  sm: `(max-width: ${BREAKPOINTS.sm}px)`,
  md: `(max-width: ${BREAKPOINTS.md}px)`,
  lg: `(max-width: ${BREAKPOINTS.lg}px)`,
  xl: `(max-width: ${BREAKPOINTS.xl}px)`,
  xxl: `(max-width: ${BREAKPOINTS.xxl}px)`,
} as const;

// ======================================================================== //
// NOTE: V2 - FOR USE in EMOTION / CSS-in-JS FILES..

export const sizes = Object.keys(BREAKPOINTS) as ScreenClass[];

// Enforce keys as breakpoint sizes using Record and ScreenClass
export type MediaQueries = Record<ScreenClass, string | number>;

// MEDIAQUERIES (VERSION v2) - for use in css-in-js style files
export const min = {} as MediaQueries;
export const max = {} as MediaQueries;

// SET MIN + MAX UTILS
for (const [key, value] of Object.entries(BREAKPOINTS)) {
  min[key] = `@media (min-width: ${value}px)`;
  max[key] = `@media (max-width: ${value}px)`;
}

