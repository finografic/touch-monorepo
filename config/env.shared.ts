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
});

export type EnvShared = typeof envShared;
