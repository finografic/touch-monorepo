import type { ReactNode } from 'react';
import type React from 'react';

import '@tanstack/react-query';

declare module 'drizzle-admin';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: Error;
  }
}

declare module 'uuid';

// Raw file imports (Vite ?raw suffix)
declare module '*?raw' {
  const content: string;
  export default content;
}

// Note: CSS module declarations are provided by Vite (vite/client.d.ts)
// No need to redeclare '*.css' or '*.module.css' here

declare namespace JSX {
  interface IntrinsicElements {
    [elementName: string]: any;
  }
}
