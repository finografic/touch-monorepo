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

  // Fallback to process.cwd() if not found
  return process.cwd();
};
