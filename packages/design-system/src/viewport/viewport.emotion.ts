import { BREAKPOINTS } from './viewport.breakpoints';
import type { ScreenClass } from './viewport.types';

// ============================================================================
// CSS-IN-JS HELPERS (emotion, etc..)
// @media wrappers — example: min.md → '@media (min-width: 768px)'
// ============================================================================

export const sizes = Object.keys(BREAKPOINTS) as ScreenClass[];

export const min = Object.fromEntries(
  Object.entries(BREAKPOINTS).map(([k, v]) => [k, `@media (min-width: ${v}px)`]),
) as Record<ScreenClass, string>;

export const max = Object.fromEntries(
  Object.entries(BREAKPOINTS).map(([k, v]) => [k, `@media (max-width: ${v}px)`]),
) as Record<ScreenClass, string>;
