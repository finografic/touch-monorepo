// @ts-check

import { ERROR, fino, OFF } from '@finografic/eslint-config';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

// NOTE: Import sorting is now handled by Prettier plugin (@ianvs/prettier-plugin-sort-imports)
// This is more reliable than ESLint plugins which have registration issues

export default [
  fino({
    ignores: ['**/*.md', '**/*.mdx', '**/*.json', '**/*.jsonc'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        // ...globals.browser, // TODO: REMOVING THIS *FIXED* ESLINT SORT ERRORS !!!
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
      'prefer-arrow-callback': OFF,
      'test/prefer-lowercase-title': OFF,

      // Disable JSX parentheses rules that conflict with Prettier
      'style/jsx-wrap-multilines': OFF,

      'unused-imports/no-unused-imports': OFF, // Don't remove unused imports automatically

      // Disable conflicting rules with simple-import-sort
      'perfectionist/sort-named-imports': OFF,
      'perfectionist/sort-object-types': OFF,
      'perfectionist/sort-objects': OFF,
      'perfectionist/sort-imports': OFF,

      // Disable other import-related rules that conflict
      'import/no-duplicates': ERROR,
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
            ['^react', '^@react', '^@finografic', '^@workspace'],
            ['^@?\\w', '^(pages|components|lib)(/.*|$)'],
            ['^(hooks|routes|providers|queries)(/.*|$)'],
            ['^\\u0000'],
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
      // 'prettier/sort-imports': OFF,
      // 'prettier/sort-named-imports': OFF,
      // 'prettier/sort-object-types': OFF,
      // 'prettier/sort-objects': OFF,
      // 'prettier/prettier': OFF,
    },
  }),
  // Override: Disable type-aware rules for .mjs and .cjs files (they don't have type information)
  // {
  //   files: ['**/*.mjs', '**/*.cjs'],
  //   rules: {
  //     'ts/consistent-type-imports': OFF,
  //     'ts/no-unused-vars': OFF,
  //   },
  // },
];
