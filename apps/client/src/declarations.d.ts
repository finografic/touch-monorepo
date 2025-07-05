import '@tanstack/react-query';
import type { AxiosError } from 'axios';
import Color from 'color';
import type { ColorConstructor as ColorContrutorType } from 'color';

// declare module 'react-grid-system';

declare module 'drizzle-admin';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AxiosError;
  }
}

declare module 'color' {
  interface ColorConstructor extends ColorContrutorType {}
}

declare module 'uuid';

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*?raw' {
  const content: string;
  export default content;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elementName: string]: any;
  }
}
