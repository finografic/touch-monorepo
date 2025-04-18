/// <reference types="vite/client" />
/// <reference types="@emotion/react/types/css-prop" />

type LogColor =
  | 'blue'
  | 'cyan'
  | 'grey'
  | 'hotpink'
  | 'lime'
  | 'magenta'
  | 'orange'
  | 'red'
  | 'violet'
  | 'white'
  | 'yellow';

declare global {
  function log(message: string, color: LogColor, ...args: any): void;
  function getDotEnv(): Record<string, any>;

  interface Window {
    log(message: string, color: LogColor, ...args: any): void;
  }
}

export {};
