import { envShared } from '@workspace/config/env.shared';
import { paths } from '@workspace/config/paths';

import path from 'node:path';
import * as v from 'valibot';

const ServerEnvSchema = v.pipe(
  v.object({
    DB_HOST: v.string(),
    DB_USER: v.string(),
    DB_PASS: v.optional(v.string()),
    DB_NAME: v.string(),
    DB_DIALECT: v.picklist(['sqlite', 'mysql', 'postgres']),
    DB_PORT: v.number(),

    BETTER_AUTH_SECRET: v.pipe(v.string(), v.minLength(32)),
    BETTER_AUTH_URL: v.pipe(v.string(), v.url()),

    AUTH_COOKIE_PREFIX: v.optional(v.string(), 'touch-monorepo'),
    TOKEN_COOKIE_SUFFIX: v.optional(v.string(), 'session_token'),
    DATA_COOKIE_SUFFIX: v.optional(v.string(), 'session_data'),

    RELAY_ENABLED: v.optional(v.boolean(), false),
    RELAY_NUM_RELAYS: v.optional(v.union([v.literal(8), v.literal(16)]), 16),
    RELAY_RECONNECT_ATTEMPTS: v.optional(v.number(), 5),
    USBRELAY_VENDOR_ID: v.optional(v.string(), '0x16c0'),
    USBRELAY_PRODUCT_ID: v.optional(v.string(), '0x05df'),
  }),
  v.transform((env) => ({
    ...env,
    DB_PATH: process.env.DB_PATH ?? path.resolve(paths.data.dir, env.DB_NAME),
  })),
);

const envServerValidated = v.parse(ServerEnvSchema, {
  DB_HOST: process.env.DB_HOST ?? 'localhost',
  DB_USER: process.env.DB_USER ?? 'admin',
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME ?? 'production.sqlite.db',
  DB_DIALECT: process.env.DB_DIALECT,
  DB_PORT: Number(process.env.DB_PORT ?? 0),

  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,

  AUTH_COOKIE_PREFIX: process.env.AUTH_COOKIE_PREFIX,
  TOKEN_COOKIE_SUFFIX: process.env.TOKEN_COOKIE_SUFFIX,
  DATA_COOKIE_SUFFIX: process.env.DATA_COOKIE_SUFFIX,

  RELAY_ENABLED: String(process.env.RELAY_ENABLED) === 'true',
  RELAY_NUM_RELAYS:
    process.env.RELAY_NUM_RELAYS && String(process.env.RELAY_NUM_RELAYS).trim() !== ''
      ? Number(process.env.RELAY_NUM_RELAYS)
      : undefined,

  RELAY_RECONNECT_ATTEMPTS:
    process.env.RELAY_RECONNECT_ATTEMPTS && String(process.env.RELAY_RECONNECT_ATTEMPTS).trim() !== ''
      ? Number(process.env.RELAY_RECONNECT_ATTEMPTS)
      : undefined,

  USBRELAY_VENDOR_ID: process.env.USBRELAY_VENDOR_ID,
  USBRELAY_PRODUCT_ID: process.env.USBRELAY_PRODUCT_ID,
});

type EnvServer = typeof envShared & typeof envServerValidated;

export const env: EnvServer = {
  ...envShared,
  ...envServerValidated,
} as const satisfies EnvServer;
