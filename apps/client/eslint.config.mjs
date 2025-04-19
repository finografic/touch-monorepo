import { ERROR, fino, OFF } from '@finografic/eslint-config';
// import simpleImport from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
// import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
// import tseslint from 'typescript-eslint';

export default fino(
  // tseslint.configs.stylistic,
  {
    // ignores: IGNORES,
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      // 'simple-import-sort': simpleImportSort,
      // 'import': simpleImport,
    },
    rules: {
      'style/no-multi-spaces': OFF,
      'regexp/prefer-w': OFF,
      'fino/top-level-function': OFF,
      'no-undef': [ERROR, { typeof: true }],
      'node/prefer-global/process': [ERROR, 'always'],
      'ts/no-unused-vars': [
        ERROR,
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
);
