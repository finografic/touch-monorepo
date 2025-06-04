import path from 'node:path';
import { paths } from '@workspace/config/paths';
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
      destination: path.resolve(paths.logs.dir, 'info.log'),
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
      destination: path.resolve(paths.logs.dir, 'error.log'),
      customPrettifiers: {
        time: (timestamp) => `[${new Date().toISOString()} ${timestamp}]`,
      },
    }),
  },
];

export const streams = isFileLoggingEnabled ? [...streamToConsole, ...streamToFile] : [...streamToConsole];
