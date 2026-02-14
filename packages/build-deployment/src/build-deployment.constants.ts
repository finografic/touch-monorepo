/** Resolved paths and configuration for the deployment build. */

import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import type { BuildConfig } from './build-deployment.types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const WORKSPACE_ROOT = resolve(__dirname, '../../..');
export const DIST_DIR = resolve(WORKSPACE_ROOT, '.temp/deployment');
export const TEMPLATES_DIR = join(__dirname, 'templates');

export const config: BuildConfig = {
  distDir: DIST_DIR,
  workspaceRoot: WORKSPACE_ROOT,
  clientDir: join(WORKSPACE_ROOT, 'apps/client'),
  serverDir: join(WORKSPACE_ROOT, 'apps/server'),
  dataDir: join(WORKSPACE_ROOT, 'data'),
  configDir: join(WORKSPACE_ROOT, 'config'),
  buildDir: join(DIST_DIR, 'dist'),
  templatesDir: TEMPLATES_DIR,
};

export const AUTO_CONFIRM = process.argv.includes('-y') || process.argv.includes('--yes');
