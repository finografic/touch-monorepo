// import simpleImport from 'eslint-plugin-import';
import { ERROR, fino, IGNORES, OFF } from '@finografic/eslint-config';

import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
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
      'simple-import-sort': simpleImportSort,
      // 'import': simpleImport,
    },
    rules: {
      'style/no-multi-spaces': OFF,
      'regexp/prefer-w': OFF,
      // Import sorting

      'simple-import-sort/imports': [
        ERROR,
        {
          groups: [
            // React imports first
            ['^react$', '^react-dom$'],
            // React-related packages
            ['^react-', '^@react'],
            // Other external packages
            ['^@?\\w'],
            // Internal absolute imports (sorted by common folder names)
            ['^(providers|types|utils|components|hooks|styles|routes|constants|lib|config)(/.*|$)'],
            // Side effect imports
            ['^\\u0000'],
            // Parent imports. Put `..` last.
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Other relative imports. Put same-folder imports and `.` last.
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports
            ['^.+\\.s?css$', '^.+\\.styles$'],
          ],
        },
      ],
      // 'simple-import-sort/exports': ERROR,
      'import/order': [
        ERROR,
        {
          'newlines-between': 'never', // or 'always' for mandatory spaces
          // 'groups': [
          //   ['builtin', 'external'],
          //   ['internal', 'parent', 'sibling', 'index'],
          // ],
        },
      ],
    },
  },
);
