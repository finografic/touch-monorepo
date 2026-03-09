import type { LogColor } from './types';

declare global {
  function log(message: string, color?: LogColor, ...args: any[]): void;
}

const _global = ((globalThis as Record<string, unknown>)['window'] ?? globalThis) as {
  log: (message: string, color?: LogColor, ...args: unknown[]) => void;
};

_global.log = function (message: string, color: LogColor = 'grey', ...args: unknown[]): void {
  const error = new Error();
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(error, _global.log);
  }
  console.log(`%c${message}`, `color:${color}`, ...args);
};
