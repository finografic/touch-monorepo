export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export const mediaQueries = {
  up: (size: Breakpoint) => `@media (min-width: ${BREAKPOINTS[size]}px)`,
  down: (size: Breakpoint) => `@media (max-width: ${BREAKPOINTS[size] - 0.02}px)`,
  between: (start: Breakpoint, end: Breakpoint) =>
    `@media (min-width: ${BREAKPOINTS[start]}px) and (max-width: ${BREAKPOINTS[end] - 0.02}px)`,
};
