import type { AxiosError } from 'axios';
import type { ColorConstructor as ColorContrutorType } from 'color';
import Color from 'color';
import type { ReactNode } from 'react';
import type React from 'react';

import '@tanstack/react-query';

// Fix react-grid-system type compatibility issues
// declare module 'react-grid-system' {
//   export interface ContainerProps {
//     fluid?: boolean;
//     children?: ReactNode;
//     className?: string;
//     style?: React.CSSProperties;
//   }

//   export interface RowProps {
//     children?: ReactNode;
//     className?: string;
//     style?: React.CSSProperties;
//     direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
//     align?: 'stretch' | 'center' | 'start' | 'end' | 'baseline';
//     justify?: 'start' | 'center' | 'end' | 'around' | 'between' | 'evenly';
//     gutterWidth?: number;
//     nogutter?: boolean;
//   }

//   export interface ColProps {
//     children?: ReactNode;
//     className?: string;
//     style?: React.CSSProperties;
//     xs?: number | boolean;
//     sm?: number | boolean;
//     md?: number | boolean;
//     lg?: number | boolean;
//     xl?: number | boolean;
//     xxl?: number | boolean;
//     offset?: {
//       xs?: number;
//       sm?: number;
//       md?: number;
//       lg?: number;
//       xl?: number;
//       xxl?: number;
//     };
//     pull?: {
//       xs?: number;
//       sm?: number;
//       md?: number;
//       lg?: number;
//       xl?: number;
//       xxl?: number;
//     };
//     push?: {
//       xs?: number;
//       sm?: number;
//       md?: number;
//       lg?: number;
//       xl?: number;
//       xxl?: number;
//     };
//   }

//   export interface VisibleProps {
//     children?: ReactNode;
//     xs?: boolean;
//     sm?: boolean;
//     md?: boolean;
//     lg?: boolean;
//     xl?: boolean;
//     xxl?: boolean;
//   }

//   export const Container: React.FC<ContainerProps>;
//   export const Row: React.FC<RowProps>;
//   export const Col: React.FC<ColProps>;
//   export const Visible: React.FC<VisibleProps>;
//   export const Hidden: React.FC<VisibleProps>;
//   export const ScreenClassProvider: React.FC<{ children?: ReactNode }>;

//   export function setConfiguration(config: any): void;
//   export function useScreenClass(): string;
// }

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
