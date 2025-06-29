import { setConfiguration } from 'react-grid-system';
import type { BreakpointMap, ScreenClass } from './viewport.types';
import { BREAKPOINTS } from './viewport.breakpoints';
import { mapNewBreakpointRules, toMediaMaxWidth, toMediaMinWidth } from './viewport.utils';

// ======================================================================== //
// NOTE: V1 - FOR USE in TSX FILES..

export const MEDIA_QUERIES = {
  // min: mapNewBreakpointRules(toMediaMinWidth) as MediaQueryMap,
  // max: mapNewBreakpointRules(toMediaMaxWidth) as MediaQueryMap,
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
// NOTE: V2 - FOR USE in CSS-in-JS FILES..

export const sizes = Object.keys(BREAKPOINTS) as ScreenClass[];

// TODO: enforce keys as breakpoint sizes
interface MediaQueries {
  [key: string]: string | number;
}

// MEDIAQUERIES (VERSION v2) - for use in css-in-js style files
export const min: MediaQueries = {};
export const max: MediaQueries = {};

// SET MIN + MAX UTILS
for (const [key, value] of Object.entries(BREAKPOINTS)) {
  min[key] = `@media (min-width: ${value}px)`;
  max[key] = `@media (max-width: ${value}px)`;
}

const containerBreakpoints = Object.values(BREAKPOINTS).slice(1);
const containerWidths = containerBreakpoints.map((value, _index) => {
  // return index === 0 ? containerBreakpoints[1] * 0.95 : value * 0.95;
  return value * 0.95;
});

setConfiguration({ containerWidths });
