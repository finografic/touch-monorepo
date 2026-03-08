import * as v from 'valibot';
import dotenv from 'dotenv';
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
    dotenv.config({ path: envPath });
    break;
  }
}

const SharedEnvSchema = v.pipe(
  v.object({
    NODE_ENV: v.optional(v.picklist(['development', 'production', 'test']), 'development'),
    API_PROTOCOL: v.optional(v.picklist(['http', 'https']), 'http'),
    API_HOST: v.optional(v.string(), 'localhost'),
    API_PORT: v.optional(v.number(), 4040),
    API_BASE_PATH: v.optional(v.string(), '/api'),
    CLIENT_PROTOCOL: v.optional(v.picklist(['http', 'https']), 'http'),
    CLIENT_HOST: v.optional(v.string(), 'localhost'),
    CLIENT_PORT: v.optional(v.number(), 3000),
    BETTER_AUTH_SECRET: v.optional(v.string(), ''),
    BETTER_AUTH_URL: v.optional(v.string(), ''),
    AUTH_COOKIE_PREFIX: v.optional(v.string(), 'touch-monorepo'),
    TOKEN_COOKIE_SUFFIX: v.optional(v.string(), 'session_token'),
    DATA_COOKIE_SUFFIX: v.optional(v.string(), 'session_data'),
    INLANG_GOOGLE_TRANSLATE_API_KEY: v.optional(v.string(), ''),
    RELAY_ENABLED: v.optional(v.boolean(), true),
    RELAY_NUM_RELAYS: v.optional(v.union([v.literal(8), v.literal(16)]), 16),
    RELAY_RECONNECT_ATTEMPTS: v.optional(v.number(), 5),
    USBRELAY_VENDOR_ID: v.optional(v.string(), '0x16c0'),
    USBRELAY_PRODUCT_ID: v.optional(v.string(), '0x05df'),
  }),
  v.transform((env) => ({
    ...env,
    API_URL: `${env.API_PROTOCOL}://${env.API_HOST}:${env.API_PORT}${env.API_BASE_PATH || ''}`,
    API_BASE_URL: `${env.API_PROTOCOL}://${env.API_HOST}:${env.API_PORT}`,
    CLIENT_ORIGIN: `${env.CLIENT_PROTOCOL}://${env.CLIENT_HOST}:${env.CLIENT_PORT}`,
    COOKIES: {
      COOKIE_PREFIX: env.AUTH_COOKIE_PREFIX,
      TOKEN_COOKIE: `${env.AUTH_COOKIE_PREFIX}.${env.TOKEN_COOKIE_SUFFIX}`,
      DATA_COOKIE: `${env.AUTH_COOKIE_PREFIX}.${env.DATA_COOKIE_SUFFIX}`,
    },
    COOKIE_DELETE_ATTRIBUTES: [
      'Max-Age=0',
      'Path=/',
      'HttpOnly',
      'SameSite=Lax',
      ...(env.NODE_ENV === 'production' ? ['Secure'] : []),
    ].join('; '),
  })),
);

const envSharedValidated = v.parse(SharedEnvSchema, {
  NODE_ENV: process.env.NODE_ENV,
  API_PROTOCOL: process.env.API_PROTOCOL,
  API_HOST: process.env.API_HOST,
  API_PORT: process.env.API_PORT ? Number(process.env.API_PORT) : undefined,
  API_BASE_PATH: process.env.API_BASE_PATH,
  CLIENT_PROTOCOL: process.env.CLIENT_PROTOCOL,
  CLIENT_HOST: process.env.CLIENT_HOST,
  CLIENT_PORT: process.env.CLIENT_PORT ? Number(process.env.CLIENT_PORT) : undefined,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  AUTH_COOKIE_PREFIX: process.env.AUTH_COOKIE_PREFIX,
  TOKEN_COOKIE_SUFFIX: process.env.TOKEN_COOKIE_SUFFIX,
  DATA_COOKIE_SUFFIX: process.env.DATA_COOKIE_SUFFIX,
  RELAY_ENABLED: process.env.RELAY_ENABLED === 'true',
  RELAY_NUM_RELAYS:
    process.env.RELAY_NUM_RELAYS && process.env.RELAY_NUM_RELAYS.trim() !== ''
      ? Number(process.env.RELAY_NUM_RELAYS)
      : undefined,
  RELAY_RECONNECT_ATTEMPTS:
    process.env.RELAY_RECONNECT_ATTEMPTS && process.env.RELAY_RECONNECT_ATTEMPTS.trim() !== ''
      ? Number(process.env.RELAY_RECONNECT_ATTEMPTS)
      : undefined,
  USBRELAY_VENDOR_ID: process.env.USBRELAY_VENDOR_ID,
  USBRELAY_PRODUCT_ID: process.env.USBRELAY_PRODUCT_ID,
});

export type EnvShared = typeof envSharedValidated;

export const envShared: EnvShared = {
  ...envSharedValidated,
} as const satisfies EnvShared;
