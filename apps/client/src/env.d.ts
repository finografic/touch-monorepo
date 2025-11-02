/// <reference types="vite/client" />
/// <reference types="@emotion/react/types/css-prop" />

import type { EnvShared } from '@workspace/config/env.shared';

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Partial<EnvShared> {
      NODE_ENV: 'development' | 'production' | 'test';
      VITE_APP_NAME: string;
    }
  }
}
