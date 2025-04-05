import { ERROR, fino, IGNORES, INCLUDE_FILES_TS, OFF } from '@finografic/eslint-config';

export default fino({
  typescript: true,
  gitignore: true,
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  overrides: {
    jsonc: {
      'jsonc/sort-keys': ERROR,
    },
  },
  rules: {
    'node/prefer-global/process': OFF,
    'prefer-regex-literals': ERROR,
  },
});
