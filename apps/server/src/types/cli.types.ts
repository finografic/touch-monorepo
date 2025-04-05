import type { ChalkInstance, ForegroundColorName } from 'chalk';
import chalk from 'chalk';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';

type ChalkColor = ChalkInstance[ForegroundColorName];

export const REQUEST_COLOR: Record<RequestMethod, ForegroundColorName> = {
  GET: 'green',
  POST: 'blue',
  PUT: 'yellow',
  DELETE: 'red',
  OPTIONS: 'magenta',
} as const;

export const REQUEST_COLOR_V2: Record<RequestMethod, ChalkColor> = {
  GET: chalk.green,
  POST: chalk.blue,
  PUT: chalk.yellow,
  DELETE: chalk.red,
  OPTIONS: chalk.magenta,
} as const;
