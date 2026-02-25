import { BREAKPOINTS } from './viewport.breakpoints';
import type { BreakpointMap, ScreenClass } from './viewport.types';
import { toMediaMaxWidth, toMediaMinWidth } from './viewport.utils';

// ============================================================================
// TYPED QUERY MAPS
// ============================================================================

/** Min-width media query strings for each breakpoint (no `@media` wrapper). */
export const QUERIES_MIN: Record<ScreenClass, string> = {
  xs: `(min-width: 0px)`,
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  '2xl': `(min-width: ${BREAKPOINTS['2xl']}px)`,
} as const;

/** Max-width media query strings for each breakpoint (no `@media` wrapper). */
export const QUERIES_MAX: Omit<Record<ScreenClass, string>, 'xs'> = {
  sm: `(max-width: ${BREAKPOINTS.sm}px)`,
  md: `(max-width: ${BREAKPOINTS.md}px)`,
  lg: `(max-width: ${BREAKPOINTS.lg}px)`,
  xl: `(max-width: ${BREAKPOINTS.xl}px)`,
  '2xl': `(max-width: ${BREAKPOINTS['2xl']}px)`,
} as const;

/** Generic min/max map — keyed by media query type. */
export const MEDIA_QUERIES: { min: Partial<BreakpointMap<string>>; max: Partial<BreakpointMap<string>> } = {
  min: Object.fromEntries(Object.entries(BREAKPOINTS).map(([k, v]) => [k, toMediaMinWidth(v)])),
  max: Object.fromEntries(Object.entries(BREAKPOINTS).map(([k, v]) => [k, toMediaMaxWidth(v)])),
};

// ============================================================================
// CSS-IN-JS HELPERS (e.g. Emotion)
// @media wrappers — e.g. min.md → '@media (min-width: 768px)'
// ============================================================================

export const sizes = Object.keys(BREAKPOINTS) as ScreenClass[];

export const min = Object.fromEntries(
  Object.entries(BREAKPOINTS).map(([k, v]) => [k, `@media (min-width: ${v}px)`]),
) as Record<ScreenClass, string>;

export const max = Object.fromEntries(
  Object.entries(BREAKPOINTS).map(([k, v]) => [k, `@media (max-width: ${v}px)`]),
) as Record<ScreenClass, string>;
