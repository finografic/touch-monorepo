import { ERROR, fino, IGNORES, INCLUDE_FILES_TS, OFF } from '@finografic/eslint-config';

export default fino({
  typescript: true,
  gitignore: true,
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      log: 'readonly',
      getDotEnv: 'readonly',
      // React: true,
    },
  },
  overrides: {
    jsonc: {
      'jsonc/sort-keys': ERROR,
    },
  },
  files: [...INCLUDE_FILES_TS],
  ignores: [...IGNORES],
  rules: {
    'node/prefer-global/process': OFF,
    'prefer-regex-literals': ERROR,
    'fino/top-level-function': OFF,
    'ts/no-unused-vars': [
      ERROR,
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
});
