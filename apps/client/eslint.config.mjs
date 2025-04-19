import { fino, IGNORES } from '@finografic/eslint-config';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
// import tseslint from 'typescript-eslint';

export default fino(
  // tseslint.configs.stylistic,
  {
    ignores: IGNORES,
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'style/no-multi-spaces': OFF,
      'regexp/prefer-w': OFF,

      // Import sorting
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // React and related packages first
            ['^react', '^@?\\w'],
            // Internal packages/components/etc
            ['^(components|hooks|utils|styles|types|providers|routes|constants)(/.*|$)'],
            // Side effect imports
            ['^\\u0000'],
            // Parent imports. Put `..` last.
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Other relative imports. Put same-folder imports and `.` last.
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports
            ['^.+\\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
);
