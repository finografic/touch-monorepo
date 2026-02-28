import { envShared } from '@workspace/config/env.shared';
import { paths } from '@workspace/config/paths';

import path from 'node:path';
import { z } from 'zod';

/**
 * Server-only environment variables
 * Loaded from consolidated .env.production
 */
const ServerEnvSchema = z
  .object({
    // ─────────────────────────────────────────────
    // Database
    // ─────────────────────────────────────────────
    DB_HOST: z.string(),
    DB_USER: z.string(),
    DB_PASS: z.string().optional(),
    DB_NAME: z.string(),
    DB_DIALECT: z.enum(['sqlite', 'mysql', 'postgres']),
    DB_PORT: z.number(),

    // ─────────────────────────────────────────────
    // Authentication
    // ─────────────────────────────────────────────
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url(),

    AUTH_COOKIE_PREFIX: z.string().default('touch-monorepo'),
    TOKEN_COOKIE_SUFFIX: z.string().default('session_token'),
    DATA_COOKIE_SUFFIX: z.string().default('session_data'),

    // ─────────────────────────────────────────────
    // Relay board (USBRelay8)
    // ─────────────────────────────────────────────
    RELAY_ENABLED: z.boolean().default(false),
    RELAY_NUM_RELAYS: z.union([z.literal(8), z.literal(16)]).default(16),
    RELAY_RECONNECT_ATTEMPTS: z.number().default(5),
    USBRELAY_VENDOR_ID: z.string().default('0x16c0'),
    USBRELAY_PRODUCT_ID: z.string().default('0x05df'),
  })
  .transform((env) => ({
    ...env,

    // Always resolve DB path relative to deployed dist/data
    DB_PATH: process.env.DB_PATH ?? path.resolve(paths.data.dir, env.DB_NAME),
  }));

/**
 * Raw process.env → typed + validated
 */
const envServerValidated = ServerEnvSchema.parse({
  // Database
  DB_HOST: process.env.DB_HOST ?? 'localhost',
  DB_USER: process.env.DB_USER ?? 'admin',
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME ?? 'production.sqlite.db',
  DB_DIALECT: process.env.DB_DIALECT,
  DB_PORT: Number(process.env.DB_PORT ?? 0),

  // Authentication
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,

  AUTH_COOKIE_PREFIX: process.env.AUTH_COOKIE_PREFIX,
  TOKEN_COOKIE_SUFFIX: process.env.TOKEN_COOKIE_SUFFIX,
  DATA_COOKIE_SUFFIX: process.env.DATA_COOKIE_SUFFIX,

  // Relay
  RELAY_ENABLED: process.env.RELAY_ENABLED === true,
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

/**
 * Final exported env
 * Safe to import anywhere in server runtime
 */
export const env: EnvServer = {
  ...envShared,
  ...envServerValidated,
} as const satisfies EnvServer;
