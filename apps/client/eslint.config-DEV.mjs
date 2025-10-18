// @ts-check

import { ERROR, fino, OFF } from '@finografic/eslint-config';

import globals from 'globals';

export default fino({
  languageOptions: {
    ecmaVersion: 'latest',
    globals: {
      ...globals.browser,
      getDotEnv: 'readonly',
      log: 'readonly',
    },
    parserOptions: {
      project: './tsconfig.json',
      parser: '@typescript-eslint/parser',
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  formatters: true,
  // react: true,
  typescript: true,
  gitignore: true,
  ignores: ['**/*.json', '**/*.jsonc', '**/*.md'],
  rules: {
    'fino/top-level-function': OFF,
    'no-undef': [ERROR, { typeof: true }],
    'node/prefer-global/process': [ERROR, 'always'],
    'regexp/prefer-w': OFF,
    'style/jsx-one-expression-per-line': OFF,
    'style/no-multi-spaces': OFF,
    'ts/no-unused-vars': OFF,
    'ts/consistent-type-imports': [
      ERROR,
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: true,
        fixStyle: 'separate-type-imports',
      },
    ],
    'jsdoc/check-alignment': OFF,
    // 'jsdoc/check-alignment': OFF,
  },
});
