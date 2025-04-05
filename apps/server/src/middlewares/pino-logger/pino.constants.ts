import type { LevelMapping } from 'pino';
import type { LevelCustom } from './pino-logger.types';
import chalk from 'chalk';

/**
 * Static copy of pino level mappings
 */
export const levels: LevelMapping = {
  labels: {
    10: 'trace',
    20: 'debug',
    30: 'info',
    40: 'warn',
    50: 'error',
    60: 'fatal',
  },
  values: {
    fatal: 60,
    error: 50,
    warn: 40,
    info: 30,
    debug: 20,
    trace: 10,
  },
};

export const levelColors = {
  debug: chalk.bold.cyan,
  error: chalk.bold,
  fatal: chalk.bold.underline,
  info: chalk.bold,
  success: chalk.bold,
  trace: chalk.bold.gray,
  warn: chalk.bold,
};

export const levelSymbols: Record<LevelCustom, string> = {
  debug: '🐞',
  error: '🔴',
  fatal: '💀',
  info: '🔵',
  success: '🟢',
  trace: '🔍',
  warn: '🟡',
};
