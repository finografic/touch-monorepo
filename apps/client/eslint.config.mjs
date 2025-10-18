// @ts-check

import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import { ERROR, fino, OFF } from '@finografic/eslint-config';

export default fino({
  ignores: ['**/*.md', '**/*.mdx', '**/*.json', '**/*.jsonc'],
  plugins: {
    'simple-import-sort': simpleImportSort,
  },
  languageOptions: {
    ecmaVersion: 'latest',
    globals: {
      ...globals.browser,
      getDotEnv: 'readonly',
      log: 'readonly',
      // React: true,
    },
    // parserOptions: {
    //   ecmaFeatures: {
    //     jsx: true,
    //   },
    // },
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
    'unused-imports/no-unused-imports': OFF, // Don't remove unused imports automatically
    // 'ts/consistent-type-imports': [
    //   ERROR,
    //   {
    //     prefer: 'type-imports',
    //     disallowTypeAnnotations: true,
    //     fixStyle: 'separate-type-imports',
    //   },
    // ],
    'jsdoc/check-alignment': OFF,
    'prefer-arrow-callback': OFF,
    'test/prefer-lowercase-title': OFF,

    // Disable conflicting rules
    'perfectionist/sort-named-imports': OFF,
    'perfectionist/sort-object-types': OFF,
    'perfectionist/sort-objects': OFF,

    // Disable unused import removal rules
    'import/no-unused-modules': OFF,
    'import/no-unresolved': OFF,

    // Import sorting rules
    'simple-import-sort/imports': [
      ERROR,
      {
        groups: [
          // React imports + React-related packages (merged) - including type imports from react
          ['^react', '^@react', '^@?\\w', '^@finografic', '^@workspace'],
          // Other external packages
          // ['^@?\\w'],
          // Internal absolute imports: components, providers, pages
          ['^(components|providers|pages)(/.*|$)'],
          // The rest of internal absolute imports + relative imports
          ['^(types|utils|hooks|routes|constants|lib|dev-tools|queries)(/.*|$)'],
          // Side effect imports
          ['^\\u0000'],
          // All relative imports (parent + same-folder + styles merged)
          ['^(config)', '^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$', '^(styles)', '^.+\\.s?css$', '^.+\\.styles$'],
        ],
      },
    ],
    'simple-import-sort/exports': ERROR,
  },
});
