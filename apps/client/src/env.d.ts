/// <reference types="vite/client" />
/// <reference types="@emotion/react/types/css-prop" />

import type { EnvShared } from '../../env.shared.js';

interface ImportMetaEnv {
  // readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvShared {
      NODE_ENV: string;
      // VITE_APP_NAME: string;
    }
  }
}
