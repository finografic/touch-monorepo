import path from 'node:path';
import { LOG_PATHS } from '../../constants/paths.constants.js';
import pretty from 'pino-pretty';

// TODO: Log rotation (rotate every day into files)
const isFileLoggingEnabled = false;

const streamToConsole = [
  {
    // Console output
    level: 'info',
    stream: pretty({
      customPrettifiers: {
        time: (timestamp) => `[${new Date().toISOString()} ${timestamp}]`,
      },
    }),
  },
  {
    // Console output
    level: 'error',
    stream: pretty({
      customPrettifiers: {
        time: (timestamp) => `[${new Date().toISOString()} ${timestamp}]`,
      },
    }),
  },
];

const streamToFile = [
  {
    // File output
    level: 'info',
    stream: pretty({
      colorize: false,
      destination: LOG_PATHS.INFO_LOG,
      customPrettifiers: {
        time: (timestamp) => `[${new Date().toISOString()} ${timestamp}]`,
      },
    }),
  },
  {
    // File output
    level: 'error',
    stream: pretty({
      colorize: false,
      destination: LOG_PATHS.ERROR_LOG,
      customPrettifiers: {
        time: (timestamp) => `[${new Date().toISOString()} ${timestamp}]`,
      },
    }),
  },
];

export const streams = isFileLoggingEnabled ? [...streamToConsole, ...streamToFile] : [...streamToConsole];
