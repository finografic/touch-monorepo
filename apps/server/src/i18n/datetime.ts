// -------------------------------------------------------------------------- //
// DATE (ONLY) FORMAT SKELETONS

export type DATE_FORMATS =
  | 'DEFAULT'
  | 'REVERSE'
  | 'MONTH'
  | 'MONTH_SHORT'
  | 'MEDIUM'
  | 'LONG'
  | 'FULL';

export const DATE_FORMAT: Record<DATE_FORMATS, string> = {
  DEFAULT: 'yyyy-MM-dd',
  REVERSE: 'dd-MM-yyyy',
  MONTH: 'MMMM yyyy',
  MONTH_SHORT: 'MMM yyyy',
  MEDIUM: 'MMM d, yyyy',
  LONG: 'MMMM d, yyyy',
  FULL: 'EEEE, d MMMM yyyy',
};

// ------------------------------------------------------------------------- //
// DATETIME FORMAT SKELETONS

export type DATETIME_FORMATS = 'DEFAULT' | 'MED' | 'LONG';

export const DATETIME_FORMAT: Record<DATETIME_FORMATS, string> = {
  DEFAULT: 'yyyy-MM-dd HH:mm:ss',
  MED: 'dd MMM yyyy HH:mm',
  LONG: 'dddd MMMM yyyy HH:mm:ss',
};

// -------------------------------------------------------------------------- //
// FILTER FORMAT SKELETONS

export type DATE_FILTERS = 'DEFAULT' | 'MONTH';

export const DATE_FILTER: Record<DATE_FILTERS, string> = {
  DEFAULT: 'yyyy-MM-dd',
  MONTH: 'yyyy-MM',
};

// -------------------------------------------------------------------------- //
// FILTER FORMAT SKELETONS

export type TIME_FORMATS = 'DEFAULT' | 'OTHER';

export const TIME_FORMAT: Record<TIME_FORMATS, string> = {
  DEFAULT: 'HH:MM:ss',
  OTHER: 'HH:MM:ss',
};
