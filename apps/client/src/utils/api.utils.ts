import chalk from 'chalk';
import { env } from 'env.client';
import type { UserConfig } from 'vite';

export function logApiURL({ mode }: Pick<UserConfig, 'mode'>) {
  const currentMode = mode || env.NODE_ENV || 'development';

  console.log(chalk.cyan.dim(`[API ${currentMode}]`), chalk.cyan.dim(env.API_URL));
}
