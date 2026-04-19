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

  // TODO: LEAVE MY PACKAGES - ⚠️ THEY IN DEVELOPMENT
  '@finografic/project-scripts',
  '@finografic/eslint-config',
];

// Packages to ignore (not update)
const IGNORE_PACKAGES_SERVER: string[] = [
  // Node types (keep stable)
  '@types/node',

  // TODO: NODE-DEPENDENT PACKAGES - MAY REQURIE REBUILDING
  // Native modules & build tools (must match Node.js version)
  // These require compilation and can break with Node version changes
  'node-gyp', // Build tool for native modules (tied to Node.js version)
  'better-sqlite3', // Native SQLite bindings (requires node-gyp)
  'node-hid', // Native USB HID bindings (requires node-gyp)
  'better-sqlite3',
  '@types/better-sqlite3',

  // TODO: PROBLEMATIC PACKAGES - CAUTION REQUIRED
  'better-sqlite3',
  '@types/better-sqlite3',
  'drizzle-kit',
  'drizzle-orm',
  'valibot',

  // TODO: LEAVE MY PACKAGES - ⚠️ THEY IN DEVELOPMENT
  // "@finografic/eslint-config": "9.0.8", (latest: v9.18.4)
  // "@finografic/project-scripts": "1.3.3", (latest: v8.5.0)
  '@finografic/project-scripts',
  '@finografic/eslint-config',
];

// Packages to ignore (not update)
// React 18 related - to avoid migrating to React 19
const IGNORE_PACKAGES_CLIENT: string[] = [
  // Core React (must match versions)
  'react',
  'react-dom',

  // Type definitions (must match React version)
  '@types/react',
  '@types/react-dom',

  // React Router v7 (may require React 19)
  'react-router-dom',
  '@react-router/dev',

  // React testing (may have peer deps on React version)
  '@testing-library/react',

  // React dev tools (may require specific React versions)
  '@vitejs/plugin-react',
  '@vitejs/plugin-react-swc',

  // Node types (keep stable)
  '@types/node',

  // Note: Other React-related packages that are usually safe to update:
  // - @radix-ui/* packages (check peer deps, but usually fine)
  // - @emotion/react, @emotion/styled (check peer deps)
  // - react-hook-form, react-i18next, react-error-boundary (usually fine)
  // - @tanstack/react-query* (usually fine, but check peer deps)
  // - eslint-plugin-react* (usually fine)

  // TODO: NODE-DEPENDENT PACKAGES - MAY REQURIE REBUILDING
  'better-sqlite3',
  '@types/better-sqlite3',

  // TODO: PROBLEMATIC PACKAGES - CAUTION REQUIRED
  'better-sqlite3',
  '@types/better-sqlite3',

  // TODO: LOCK MY PACKAGES - THEY ARE IN DEVELOPMENT
  '@finografic/project-scripts',
  '@finografic/eslint-config',
];
