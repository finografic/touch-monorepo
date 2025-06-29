export type ScreenClass = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type BreakpointMap<T> = { [key in ScreenClass]?: T };

export type ScreenSizePropsMinScope<T> = [ScreenClass, BreakpointMap<T>];
export type ScreenSizePropsMaxScope<T> = [Exclude<ScreenClass, 'xs'>, BreakpointMap<T>];

export interface MediaQueryProps {
  query: string;
  props: unknown;
}

export interface BreakpointDefaults extends BreakpointMap<number> {
  xs?: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl?: number;
  // xxxl?: number;
}

export interface MediaQueryMap {
  xs?: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl?: string;
  // xxxl?: string;
}

export interface ColumnSizes extends BreakpointMap<number> {}
