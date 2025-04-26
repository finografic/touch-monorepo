// @ts-check
/** @type {import('@finografic/eslint-config').ESLintConfig} */

import { ERROR, fino, OFF } from '@finografic/eslint-config';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default fino({
  languageOptions: {
    ecmaVersion: 2020,
    globals: {
      ...globals.browser,
      getDotEnv: 'readonly',
      log: 'readonly',
    },
  },
  plugins: {
    'react': reactPlugin,
    'react-hooks': reactHooksPlugin,
  },
  react: true,
  typescript: true,
  rules: {
    'fino/top-level-function': OFF,
    'no-undef': [ERROR, { typeof: true }],
    'node/prefer-global/process': [ERROR, 'always'],
    'regexp/prefer-w': OFF,
    'style/jsx-one-expression-per-line': OFF,
    'style/no-multi-spaces': OFF,
    'ts/no-unused-vars': OFF,
  },
});
