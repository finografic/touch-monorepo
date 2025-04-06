/* eslint-disable */
/// <reference types="vite/client" />
/// <reference types="@emotion/react/types/css-prop" />

declare global {
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

  interface Window {
    log(message: string, color: LogColor, ...args: any): void;
  }
}

export {};
