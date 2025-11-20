import type { envShared } from '@workspace/config/env.shared';

declare const envServerValidated: {
  DB_PATH: string;
  DB_HOST: string;
  DB_USER: string;
  DB_NAME: string;
  DB_DIALECT: 'sqlite' | 'mysql' | 'postgres';
  DB_PORT: number;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  AUTH_COOKIE_PREFIX: string;
  TOKEN_COOKIE_SUFFIX: string;
  DATA_COOKIE_SUFFIX: string;
  RELAY_ENABLED: boolean;
  RELAY_PORT: string;
  RELAY_BAUD_RATE: number;
  RELAY_TIMEOUT: number;
  RELAY_RECONNECT_ATTEMPTS: number;
  RELAY_NUM_RELAYS: 8 | 16;
  DB_PASS?: string | undefined;
};

type EnvServer = typeof envShared & typeof envServerValidated;
export declare const env: EnvServer;

export {};
