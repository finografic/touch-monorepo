import path from 'node:path';
import { config } from '@dotenvx/dotenvx';
import { envShared } from '@workspace/config/envShared';
import { paths } from '@workspace/config/paths';
import { z } from 'zod';
import { fileURLToPath } from 'node:url';

// ======================================================================== //

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dotenvx automatically loads .env files from current directory and parent directories
// No need for manual path resolution

// ======================================================================== //

const envServerSchema = z
  .object({
    DB_HOST: z.string(),
    DB_USER: z.string(),
    DB_PASS: z.string().optional(),
    DB_NAME: z.string(),
    DB_DIALECT: z.enum(['sqlite', 'mysql', 'postgres']),
    DB_PORT: z.number(),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url(),
  })
  .transform((env) => ({
    ...env,
    DB_PATH: process.env.DB_PATH || path.resolve(paths.data.dir, env.DB_NAME),
  }));

const envServerValidated = envServerSchema.parse({
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME,
  DB_DIALECT: process.env.DB_DIALECT,
  DB_PORT: Number(process.env.DB_PORT),
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
});

export const env = {
  ...envShared,
  ...envServerValidated,
} as const;

export type EnvServer = typeof env;
