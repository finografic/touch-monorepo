import path from 'node:path';
import { envShared } from '@workspace/config/env.shared';
import { paths } from '@workspace/config/paths';
import { z } from 'zod';

const ServerEnvSchema = z
  .object({
    // Database
    DB_HOST: z.string(),
    DB_USER: z.string(),
    DB_PASS: z.string().optional(),
    DB_NAME: z.string(),
    DB_DIALECT: z.enum(['sqlite', 'mysql', 'postgres']),
    DB_PORT: z.number(),
    // Authentication
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url(),
    // Relay board
    RELAY_ENABLED: z.boolean().default(false),
    RELAY_PORT: z.string().default('/dev/ttyUSB0'),
    RELAY_BAUD_RATE: z.number().default(9600),
    RELAY_TIMEOUT: z.number().optional().default(5000),
    RELAY_RECONNECT_ATTEMPTS: z.number().optional().default(5),
  })
  .transform((env) => ({
    ...env,
    DB_PATH: process.env.DB_PATH || path.resolve(paths.data.dir, env.DB_NAME),
  }));

const envServer = ServerEnvSchema.parse({
  // Database
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME,
  DB_DIALECT: process.env.DB_DIALECT,
  DB_PORT: Number(process.env.DB_PORT),
  // Authentication
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  // Relay board
  RELAY_ENABLED: process.env.RELAY_ENABLED === 'true',
  RELAY_PORT: process.env.RELAY_PORT,
  RELAY_BAUD_RATE: Number(process.env.RELAY_BAUD_RATE),
  RELAY_TIMEOUT: process.env.RELAY_TIMEOUT ? Number(process.env.RELAY_TIMEOUT) : undefined,
  RELAY_RECONNECT_ATTEMPTS: process.env.RELAY_RECONNECT_ATTEMPTS
    ? Number(process.env.RELAY_RECONNECT_ATTEMPTS)
    : undefined,
});

export const env = {
  ...envShared,
  ...envServer,
} as const;

export type EnvServer = typeof env;
