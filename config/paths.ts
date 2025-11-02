import path from 'node:path';
import fs from 'node:fs';

const findRootDir = (): string => {
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
