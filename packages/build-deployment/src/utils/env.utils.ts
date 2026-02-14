/** Environment file generation for production deployments. */

import { join } from 'path';
import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';

import type { BuildConfig } from '../build-deployment.types.js';

/** Parse a .env file into a key-value record (ignores comments and blank lines). */
function parseEnvFile(content: string): Record<string, string> {
  return Object.fromEntries(
    content
      .split('\n')
      .filter((line) => line.trim() && !line.startsWith('#'))
      .map((line) => {
        const [key, ...valueParts] = line.split('=');
        return [key.trim(), valueParts.join('=').trim()];
      }),
  );
}

/**
 * Generate a consolidated .env.production for the deployment.
 *
 * Uses localhost for all platforms — the client detects the correct host
 * dynamically via window.location.hostname at runtime, and the server
 * accepts any origin for CORS.
 */
export async function consolidateEnvironmentFiles({ config }: { config: BuildConfig }): Promise<void> {
  console.log('⚙️  Consolidating environment files...');

  try {
    const HOST = 'localhost';
    console.log(`📍 Using host: ${HOST} (dynamic detection at runtime)`);

    // Read source .env.production for sensitive values
    const sourceEnvPath = join(config.workspaceRoot, '.env.production');
    let sourceEnv: Record<string, string> = {};

    if (existsSync(sourceEnvPath)) {
      sourceEnv = parseEnvFile(await readFile(sourceEnvPath, 'utf-8'));
      console.log('✅ Read source .env.production for sensitive values');
    } else {
      console.log('⚠️  Source .env.production not found, using defaults');
    }

    const BETTER_AUTH_SECRET =
      sourceEnv.BETTER_AUTH_SECRET || 'your-super-secret-auth-key-minimum-32-characters-long';
    const AUTH_COOKIE_PREFIX = sourceEnv.AUTH_COOKIE_PREFIX || 'touch-monorepo';
    const TOKEN_COOKIE_SUFFIX = sourceEnv.TOKEN_COOKIE_SUFFIX || 'session_token';
    const DATA_COOKIE_SUFFIX = sourceEnv.DATA_COOKIE_SUFFIX || 'session_data';

    const envContent: string[] = [
      '# PRODUCTION ENVIRONMENT - AUTO-GENERATED',
      '# DO NOT EDIT MANUALLY',
      '',
      '# Application Environment',
      'NODE_ENV=production',
      '',
      '# API Server Configuration',
      'API_PROTOCOL=http',
      `API_HOST=${HOST}`,
      'API_PORT=4040',
      'API_BASE_PATH=/api',
      `API_URL=http://${HOST}:4040/api`,
      '',
      '# Client Configuration',
      'CLIENT_PROTOCOL=http',
      `CLIENT_HOST=${HOST}`,
      'CLIENT_PORT=3000',
      `CLIENT_ORIGIN=http://${HOST}:3000`,
      'VITE_APP_NAME=Touch Monorepo',
      '',
      '# Database Configuration',
      'DB_DIALECT=sqlite',
      'DB_HOST=localhost',
      'DB_USER=admin',
      'DB_PORT=0',
      'DB_NAME=production.sqlite.db',
      'DATABASE_URL=./dist/data/db/production.sqlite.db',
      '',
      '# Authentication',
      `BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}`,
      `BETTER_AUTH_URL=http://${HOST}:4040`,
      `AUTH_COOKIE_PREFIX=${AUTH_COOKIE_PREFIX}`,
      `TOKEN_COOKIE_SUFFIX=${TOKEN_COOKIE_SUFFIX}`,
      `DATA_COOKIE_SUFFIX=${DATA_COOKIE_SUFFIX}`,
      '',
      '# File Uploads',
      'UPLOAD_DIR=./dist/data/uploads',
      '',
      '# Path Configuration',
      'DATA_DIR=./dist/data',
      'LOGS_DIR=./dist/data/logs',
      'UPLOADS_DIR=./dist/data/uploads',
      '',
      '# Relay Board Configuration',
      'RELAY_ENABLED=true',
      'RELAY_NUM_RELAYS=16',
      'RELAY_RECONNECT_ATTEMPTS=5',
      'USBRELAY_VENDOR_ID=0x16c0',
      'USBRELAY_PRODUCT_ID=0x05df',
      '',
    ];

    const envPath = join(config.distDir, '.env.production');
    await writeFile(envPath, envContent.join('\n'), 'utf-8');

    console.log('✅ Created environment file:', envPath);
    console.log('✅ Environment files consolidated');
  } catch (error) {
    console.error('❌ Failed to consolidate environment files:', error);
    throw error;
  }
}
