// @ts-check

import { ERROR, fino, OFF } from '@finografic/eslint-config';
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
  formatters: true,
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
    // 'react/no-unknown-property': [ERROR, { ignore: ['css'] }],
    // 'react-dom/no-unknown-property': [ERROR, { ignore: ['css'] }],
  },
});
