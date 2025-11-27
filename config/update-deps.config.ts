import type { I18nConfig } from '@workspace/i18n/config/types';

export type * from './generated/i18n/language.types';
export * from './generated/i18n/constants.generated';

const IGNORE_PACKAGES_ROOT: string[] = [
  // Node types (keep stable)
  '@types/node',

  // TODO: NODE-DEPENDENT PACKAGES - MAY REQURIE REBUILDING
  // Native modules & build tools (must match Node.js version)
  // These require compilation and can break with Node version changes
  'node-gyp', // Build tool for native modules (tied to Node.js version)
  'better-sqlite3', // Native SQLite bindings (requires node-gyp)
  '@types/better-sqlite3',

  // TODO: PROBLEMATIC PACKAGES - ⚠️ CAUTION REQUIRED
  'better-sqlite3',
  '@types/better-sqlite3',
  'zod',

  // TODO: LEAVE MY PACKAGES - ⚠️ THEY IN DEVELOPMENT
  '@finografic/project-scripts',
  '@finografic/eslint-config',
];
