export type ScreenClass = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type BreakpointMap<T> = { [key in ScreenClass]?: T };

export interface MediaQueryProps {
  query: string;
  props: unknown;
}

export interface BreakpointDefaults extends BreakpointMap<number> {
  'xs'?: number;
  'sm': number;
  'md': number;
  'lg': number;
  'xl': number;
  '2xl'?: number;
}

export type MediaQueryType = 'min' | 'max';
export type MediaQueryMap = { [key in MediaQueryType]: Partial<BreakpointMap<number>> };

export interface ColumnSizes extends BreakpointMap<number> {}
