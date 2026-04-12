import chalk from 'chalk';
import type { UserConfig } from 'vite';

import { envClient } from './env.client';

export function logApiURL({ mode }: Pick<UserConfig, 'mode'>) {
  console.log(
    chalk.cyan.dim(`[API ${mode || envClient.NODE_ENV || 'development'}]`),
    chalk.cyan.dim(envClient.API_URL),
  );
}
