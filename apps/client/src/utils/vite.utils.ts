import chalk from 'chalk';
import type { UserConfig } from 'vite';

export function logApiURL({ mode }: Pick<UserConfig, 'mode'>) {
  const currentMode = mode || process.env.NODE_ENV || 'development';
  const apiUrl = 'http://localhost:4040/api';

  console.log(chalk.cyan.dim(`[API ${currentMode}]`), chalk.cyan.dim(apiUrl));
}
