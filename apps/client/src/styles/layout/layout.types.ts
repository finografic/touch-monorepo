export type ValueByUnit =
  | `${number}${'px' | 'rem' | 'em' | '%' | 'vh' | 'vw' | 'vmin' | 'vmax'}`
  | '0'
  | 'none';

export interface SpacingValues {
  none: ValueByUnit;
  px: ValueByUnit;
  xs: ValueByUnit;
  sm: ValueByUnit;
  md: ValueByUnit;
  default: ValueByUnit;
  lg: ValueByUnit;
  xl: ValueByUnit;
  xxl: ValueByUnit;
  xxxl: ValueByUnit;
  xxxxl: ValueByUnit;
}

export interface SpacingValueMap {
  padding: SpacingValues;
  spacing: SpacingValues;
}

export interface BorderValues {
  width: {
    none: ValueByUnit;
    light: ValueByUnit;
    default: ValueByUnit;
    heavy: ValueByUnit;
  };
  radius: {
    none: ValueByUnit;
    xs: ValueByUnit;
    sm: ValueByUnit;
    md: ValueByUnit;
    lg: ValueByUnit;
    xl: ValueByUnit;
    xxl: ValueByUnit;
    full: ValueByUnit;
  };
}
