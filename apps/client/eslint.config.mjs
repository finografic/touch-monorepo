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
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  formatters: true,
  // react: true,
  typescript: true,
  rules: {
    'fino/top-level-function': OFF,
    'no-undef': [ERROR, { typeof: true }],
    'node/prefer-global/process': [ERROR, 'always'],
    'regexp/prefer-w': OFF,
    'style/jsx-one-expression-per-line': OFF,
    'style/no-multi-spaces': OFF,
    'ts/no-unused-vars': OFF,

    // React specific rules
    // 'react/prop-types': ERROR,
    // 'react-dom/no-unknown-property': [ERROR, { ignore: ['css'] }],
    // 'react/jsx-uses-react': ERROR,
    // 'react/jsx-uses-vars': ERROR,
    // 'react-hooks/rules-of-hooks': ERROR,
    // 'react-hooks/exhaustive-deps': ERROR,
    'ts/consistent-type-imports': [
      ERROR,
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: true,
        fixStyle: 'separate-type-imports',
      },
    ],
  },
});
