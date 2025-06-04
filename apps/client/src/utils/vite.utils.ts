import { envShared } from '@workspace/config/envShared';
import chalk from 'chalk';
import type { UserConfig } from 'vite';

export function logApiURL({ mode }: Pick<UserConfig, 'mode'>) {
  const currentMode = mode || process.env.NODE_ENV || 'development';

  console.log(chalk.cyan.dim(`[API ${currentMode}]`), chalk.cyan.dim(envShared.API_URL));
}
