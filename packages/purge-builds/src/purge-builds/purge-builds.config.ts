// Never delete these
export const GLOB_DELETE_EXCLUDE = [
  '.git',
  '.env',
  '.env.*',
  'pnpm-workspace.yaml',
  'package.json',
  'apps',
  'packages',
  'config',
  'scripts',
  'packages/purge-builds/dist', // Don't delete the CLI tool itself!
  'packages/purge-builds/**', // Don't delete the CLI tool itself!
] as const;

// Patterns to delete, in order of safety
export const GLOB_DELETE_INCLUDE = [
  // Build artifacts first
  '**/.turbo',
  '**/.tsup',
  '**/dist',
  '**/*.tsbuildinfo',

  // PNPM specific - most problematic parts first
  '**/node_modules/.pnpm/**/.*',
  '**/node_modules/.pnpm/**/*',
  '**/node_modules/.pnpm',
  '**/node_modules',

  // Root specific files
  'pnpm-lock.yaml',
] as const;
