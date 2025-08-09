import { z } from 'zod';
import { config } from '@dotenvx/dotenvx';
import path from 'node:path';
import fs from 'node:fs';

// Simple root directory resolution
const findRootDir = (): string => {
  let currentDir = process.cwd();

  while (currentDir !== path.parse(currentDir).root) {
    // Look for workspace markers
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

  // Fallback to process.cwd() if not found
  return process.cwd();
};

const rootDir = findRootDir();

// Load environment files from root directory
const NODE_ENV_VALUE = process.env.NODE_ENV || 'development';
const envPaths = [path.resolve(rootDir, `.env.${NODE_ENV_VALUE}`), path.resolve(rootDir, '.env')];

const debug = process.env.DEBUG_DEPLOYMENT === '1';
if (debug) {
  console.log('[env.shared] resolving env file', {
    NODE_ENV_VALUE,
    rootDir,
    envPaths,
  });
}

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    if (debug) console.log('[env.shared] loading env file:', envPath);
    config({ path: envPath });
    break;
  }
}

const envSharedSchema = z
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

export const envShared = envSharedSchema.parse({
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

// Configurable paths utility to replace @workspace/config/paths
// Allow override of base directories via environment variables
const dataDir = process.env.DATA_DIR || 'data';
const logsDir = process.env.LOGS_DIR || 'logs';
const uploadsDir = process.env.UPLOADS_DIR || path.join(dataDir, 'uploads');

export const paths = {
  root: rootDir,
  data: {
    dir: path.join(rootDir, dataDir),
    path: (...segments: string[]) => path.join(rootDir, dataDir, ...segments),
  },
  uploads: {
    dir: path.join(rootDir, uploadsDir),
    path: (...segments: string[]) => path.join(rootDir, uploadsDir, ...segments),
  },
  logs: {
    dir: path.join(rootDir, logsDir),
    path: (...segments: string[]) => path.join(rootDir, logsDir, ...segments),
  },
} as const;
