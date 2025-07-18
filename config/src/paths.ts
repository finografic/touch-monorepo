import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const currentFileUrl = import.meta.url;
const currentFilePath = fileURLToPath(currentFileUrl);
const currentDir = path.dirname(currentFilePath);

/**
 * Finds the root directory of the project by looking for package.json
 * @param startDir - Directory to start searching from
 * @returns Path to project root
 */
const findRootDir = (startDir: string) => {
  let currentDir = startDir;

  while (currentDir !== path.parse(currentDir).root) {
    const hasNpmrc = fs.existsSync(path.join(currentDir, '.npmrc'));
    const hasWorkspaceFile = fs.existsSync(path.join(currentDir, 'pnpm-workspace.yaml'));

    if (hasNpmrc && hasWorkspaceFile) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
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
