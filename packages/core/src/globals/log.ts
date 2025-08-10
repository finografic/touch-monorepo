import type { LogColor } from './types';

declare global {
  function log(message: string, color?: LogColor, ...args: any[]): void;
}

const _global = (typeof window !== 'undefined' ? window : global) as any;

_global.log = function (message: string, color: LogColor = 'grey', ...args: any[]): void {
  const error = new Error();
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(error, _global.log);
  }

  color = color || 'grey';
  if (args.length > 0) {
    console.log(`%c${message}`, `color:${color}`, ...args);
  } else {
    console.log(`%c${message}`, `color:${color}`);
  }
};
