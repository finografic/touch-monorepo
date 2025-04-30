import { ERROR, fino, OFF } from '@finografic/eslint-config';

export default fino({
  typescript: {
    parserOptions: {
      project: './tsconfig.base.json',
      parser: '@typescript-eslint/parser',
      tsconfigRootDir: '.',
    },
  },
  gitignore: true,
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      log: 'readonly',
      getDotEnv: 'readonly',
    },
  },
  overrides: {
    jsonc: {
      'jsonc/sort-keys': ERROR,
    },
  },
  rules: {
    'node/prefer-global/process': OFF,
    'prefer-regex-literals': ERROR,
    'fino/top-level-function': OFF,
    'ts/consistent-type-imports': [
      ERROR,
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: true,
        fixStyle: 'separate-type-imports',
      },
    ],
    'ts/no-unused-vars': [
      ERROR,
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'jsdoc/check-alignment': OFF,
  },
});
