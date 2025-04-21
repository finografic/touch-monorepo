import { ERROR, fino, IGNORES, INCLUDE_FILES_TS, OFF } from '@finografic/eslint-config';

export default fino({
  typescript: true,
  gitignore: true,
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  files: [...INCLUDE_FILES_TS],
  ignores: [...IGNORES],
  rules: {
    'node/prefer-global/process': OFF,
    'import/no-duplicates': ERROR,
    'ts/no-unused-vars': OFF,
    'ts/no-undef': OFF,
    'no-unused-vars': OFF,
  },
});
