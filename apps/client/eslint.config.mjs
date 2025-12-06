// @ts-check

import { ERROR, fino, OFF } from '@finografic/eslint-config';

import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

// NOTE: Import sorting is now handled by Prettier plugin (@ianvs/prettier-plugin-sort-imports)
// This is more reliable than ESLint plugins which have registration issues

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
    // 'style/jsx-one-expression-per-line': OFF,
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
    'unused-imports/no-unused-imports': OFF, // Don't remove unused imports automatically
    // 'ts/consistent-type-imports': [
    //   ERROR,
    //   {
    //     prefer: 'type-imports',
    //     disallowTypeAnnotations: true,
    //     fixStyle: 'separate-type-imports',
    //   },
    // ],
    'prefer-arrow-callback': OFF,
    'test/prefer-lowercase-title': OFF,

    // Disable JSX parentheses rules that conflict with Prettier
    'style/jsx-wrap-multilines': OFF,
    // Disable conflicting rules with simple-import-sort
    'perfectionist/sort-named-imports': OFF,
    'perfectionist/sort-object-types': OFF,
    'perfectionist/sort-objects': OFF,
    'perfectionist/sort-imports': OFF,

    // Disable other import-related rules that conflict
    'import/order': OFF,
    'import/sort-imports': OFF,
    'sort-imports': OFF,

    // Disable unused import removal rules
    'import/no-unused-modules': OFF,
    'import/no-unresolved': OFF,

    // Import sorting rules
    'simple-import-sort/imports': [
      ERROR,
      {
        groups: [
          // React imports + React-related packages (merged) - including type imports from react
          ['^react', '^@react', '^@finografic', '^@workspace'],
          // Internal absolute imports: components, providers, pages
          ['^@?\\w', '^(pages|components|lib)(/.*|$)'],
          // The rest of internal absolute imports + relative imports
          // NOTE: V1
          // ['^(types|utils|hooks|routes|constants|lib|queries)(/.*|$)'],
          // NEW: V2
          ['^(hooks|routes|providers|queries)(/.*|$)'],
          // Side effect imports
          ['^\\u0000'],
          // All relative imports (parent + same-folder + styles merged)
          // NOTE: V1
          // ['^(config|dev-tools)', '^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$', '^(styles)', '^.+\\.s?css$', '^.+\\.styles$'],
          // NEW: V2
          [
            '^(utils)',
            '^(types|constants)',
            '^(config|dev-tools)',
            '^\\.\\.(?!/?$)',
            '^\\.\\./?$',
            '^\\./(?=.*/)(?!/?$)',
            '^\\.(?!/?$)',
            '^\\./?$',
            '^(styles)',
            '^.+\\.s?css$',
            '^.+\\.styles$',
          ],
        ],
      },
    ],
    'simple-import-sort/exports': ERROR,
    'style/jsx-one-expression-per-line': OFF,
  },
});
