import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const currentFileUrl = import.meta.url;
const currentFilePath = fileURLToPath(currentFileUrl);
const currentDir = path.dirname(currentFilePath);

/**
 * Finds the root directory of the project by looking for workspace markers.
 * Supports deployment mode via PROJECT_ROOT / DEPLOYMENT_ROOT environment variables.
 */
const findRootDir = (startDir: string) => {
  // Deployment override
  const deploymentRootFromEnv = process.env.PROJECT_ROOT || process.env.DEPLOYMENT_ROOT;
  if (deploymentRootFromEnv && fs.existsSync(deploymentRootFromEnv)) {
    return path.resolve(deploymentRootFromEnv);
  }

  let currentDir = startDir;

  while (currentDir !== path.parse(currentDir).root) {
    const hasNpmrc = fs.existsSync(path.join(currentDir, '.npmrc'));
    const hasWorkspaceFile = fs.existsSync(path.join(currentDir, 'pnpm-workspace.yaml'));

    if (hasNpmrc && hasWorkspaceFile) {
      return currentDir;
    }

    // Fallback: deployment artifact detection (folder that contains dist/)
    const hasDist = fs.existsSync(path.join(currentDir, 'dist'));
    const hasDeploymentMarkers =
      fs.existsSync(path.join(currentDir, 'start-server.js')) ||
      fs.existsSync(path.join(currentDir, 'ports.utils.js'));
    if (hasDist && hasDeploymentMarkers) {
      return currentDir;
    }

    currentDir = path.dirname(currentDir);
  }

  // Final fallback: two levels up from compiled files (common in bundled output)
  const twoUp = path.resolve(startDir, '..', '..');
  if (fs.existsSync(path.join(twoUp, 'dist'))) {
    return twoUp;
  }

  throw new Error('Could not find project root directory');
};

const rootDir = findRootDir(currentDir);

/**
 * Project path utilities
 * @property {string} dir - Base directory for this path category
 * @property {Function} path - Function to get path to specific file(s) in this category
 */
export const paths = {
  root: rootDir,
  config: {
    dir: path.join(rootDir, 'config'),
    path: (...segments: string[]) => path.join(rootDir, 'config', ...segments),
  },
  data: {
    dir: path.join(rootDir, 'data'),
    path: (...segments: string[]) => path.join(rootDir, 'data', ...segments),
  },
  uploads: {
    dir: path.join(rootDir, 'data', 'uploads'),
    path: (...segments: string[]) => path.join(rootDir, 'data', 'uploads', ...segments),
  },
  logs: {
    dir: path.join(rootDir, 'logs'),
    path: (...segments: string[]) => path.join(rootDir, 'logs', ...segments),
  },
} as const;
