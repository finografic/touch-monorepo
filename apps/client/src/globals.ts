/* eslint-disable no-restricted-globals */
/* eslint-disable unicorn/error-message */
import type { LogColor } from 'types/logger.types';

declare global {
  function log(message: string, color: LogColor, ...args: any): void;
  function getDotEnv(): Record<string, any>;
}

const _global = (window /* browser */ || global) /* node */ as any;

_global.log = function (message: string, color: LogColor, ...args: any): void {
  const error = new Error();
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(error, _global.log);
  }

  // TODO: CALLER is the FILE that made the call to log()
  // Get the caller's file and line number
  const caller = error.stack?.split('\n')[1]?.trim();

  color = color || 'white';
  if (args) {
    console.log(`%c${message}`, `color:${color}`, ...args);
  } else {
    console.log(`%c${message}`, `color:${color}`);
  }
};

_global.getDotEnv = function (): Record<string, any> {
  const envProps = {} as Record<string, any>;
  if (import.meta.env) {
    for (const [key, value] of Object.entries(import.meta.env)) {
      Object.assign(envProps, { [key.replace('VITE_', '')]: value });
    }
  } else if (process.env) {
    for (const [key, value] of Object.entries(process.env)) {
      Object.assign(envProps, { [key.replace('REACT_APP_', '')]: value });
    }
  }
  return envProps;
};

export {};
