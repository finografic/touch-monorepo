import pc from 'picocolors';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';

type ColorFn = (str: string) => string;

export const REQUEST_COLOR: Record<RequestMethod, string> = {
  GET: 'green',
  POST: 'blue',
  PUT: 'yellow',
  DELETE: 'red',
  OPTIONS: 'magenta',
} as const;

export const REQUEST_COLOR_V2: Record<RequestMethod, ColorFn> = {
  GET: pc.green,
  POST: pc.blue,
  PUT: pc.yellow,
  DELETE: pc.red,
  OPTIONS: pc.magenta,
} as const;
