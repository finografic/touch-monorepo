import { z } from 'zod';
import { config } from '@dotenvx/dotenvx';
import path from 'node:path';
import fs from 'node:fs';

export const findRootDir = (): string => {
  let currentDir = process.cwd();

  while (currentDir !== path.parse(currentDir).root) {
    if (fs.existsSync(path.join(currentDir, 'pnpm-workspace.yaml'))) {
      return currentDir;
    }
    if (fs.existsSync(path.join(currentDir, 'package.json'))) {
      const pkg = JSON.parse(fs.readFileSync(path.join(currentDir, 'package.json'), 'utf8'));
      if (pkg.name === 'touch-monorepo') {
        return currentDir;
      }
    }
    currentDir = path.dirname(currentDir);
  }

  return process.cwd();
};

const rootDir = findRootDir();
const NODE_ENV_VALUE = process.env.NODE_ENV || 'development';
const envPaths = [path.resolve(rootDir, `.env.${NODE_ENV_VALUE}`), path.resolve(rootDir, '.env')];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    config({ path: envPath });
    break;
  }
}

const SharedEnvSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    API_PROTOCOL: z.enum(['http', 'https']).default('http'),
    API_HOST: z.string().default('localhost'),
    API_PORT: z.number().default(4040),
    API_BASE_PATH: z.string().default('/api'),
    CLIENT_PROTOCOL: z.enum(['http', 'https']).default('http'),
    CLIENT_HOST: z.string().default('localhost'),
    CLIENT_PORT: z.number().default(3000),
    //
    BETTER_AUTH_SECRET: z.string().default(''),
    BETTER_AUTH_URL: z.string().default(''),
    AUTH_COOKIE_PREFIX: z.string().default('touch-monorepo'),
    AUTH_COOKIE_SUFFIX: z.string().default('auth_token'),
    INLANG_GOOGLE_TRANSLATE_API_KEY: z.string().optional().default(''),
    // Relay board configuration
    RELAY_ENABLED: z.boolean().default(false),
    RELAY_PORT: z.string().default(''),
    RELAY_BAUD_RATE: z.number().default(9600),
    RELAY_TIMEOUT: z.number().optional().default(5000),
  })
  .transform((env) => ({
    ...env,
    API_URL: `${env.API_PROTOCOL}://${env.API_HOST}:${env.API_PORT}${env.API_BASE_PATH || ''}`,
    API_BASE_URL: `${env.API_PROTOCOL}://${env.API_HOST}:${env.API_PORT}`,
    CLIENT_ORIGIN: `${env.CLIENT_PROTOCOL}://${env.CLIENT_HOST}:${env.CLIENT_PORT}`,
  }));

export const envShared = SharedEnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  API_PROTOCOL: process.env.API_PROTOCOL,
  API_HOST: process.env.API_HOST,
  API_PORT: Number(process.env.API_PORT),
  API_BASE_PATH: process.env.API_BASE_PATH,
  CLIENT_ORIGIN: process.env.ORIGIN,
  CLIENT_HOST: process.env.CLIENT_HOST,
  CLIENT_PORT: Number(process.env.CLIENT_PORT),
  //
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  AUTH_COOKIE_PREFIX: process.env.AUTH_COOKIE_PREFIX,
  AUTH_COOKIE_SUFFIX: process.env.AUTH_COOKIE_SUFFIX,
  // INLANG_GOOGLE_TRANSLATE_API_KEY: process.env.INLANG_GOOGLE_TRANSLATE_API_KEY,
  RELAY_ENABLED: process.env.RELAY_ENABLED === 'true',
  RELAY_PORT: process.env.RELAY_PORT,
  RELAY_BAUD_RATE: Number(process.env.RELAY_BAUD_RATE),
  RELAY_TIMEOUT: process.env.RELAY_TIMEOUT ? Number(process.env.RELAY_TIMEOUT) : undefined,
  RELAY_RECONNECT_ATTEMPTS: process.env.RELAY_RECONNECT_ATTEMPTS
    ? Number(process.env.RELAY_RECONNECT_ATTEMPTS)
    : undefined,
});

export type EnvShared = typeof envShared;
