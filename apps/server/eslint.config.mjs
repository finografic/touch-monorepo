import { ERROR, fino, OFF } from '@finografic/eslint-config';

import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default fino({
  ignores: ['**/*.md', '**/*.mdx', '**/*.json', '**/*.jsonc'],
  plugins: {
    'simple-import-sort': simpleImportSort,
  },
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      log: 'readonly',
      getDotEnv: 'readonly',
    },
  },
  typescript: true,
  rules: {
    // ...prettier.rules,
    // 'prettier/prettier': [
    //   ERROR,
    //   {
    //     printWidth: 100,
    //     // ... other options
    //   },
    // ],
    'node/prefer-global/process': OFF,
    'import/no-duplicates': ERROR,
    // '@typescript-eslint/no-explicit-any': OFF,
    // '@typescript-eslint/no-unused-vars': WARN,
    // '@typescript-eslint/no-shadow': OFF,
    // 'no-console': 0,
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
    'ts/no-undef': OFF,
    'no-unused-vars': OFF,
    'fino/top-level-function': OFF,
    'jsdoc/check-alignment': OFF,

    'unused-imports/no-unused-imports': OFF, // Don't remove unused imports automatically

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
          ['^@finografic', '^@workspace'],
          ['^@?\\w', '^(drizzle|drizzle-orm|stoker|zod)(/.*|$)'],
          // Internal absolute imports: components, providers, pages
          ['^@?\\w', '^(pages|components)(/.*|$)'],
          // Side effect imports
          ['^\\u0000'],
          // All relative imports (parent + same-folder + styles merged)
          // NOTE: V1
          // ['^(config|dev-tools)', '^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$', '^(styles)', '^.+\\.s?css$', '^.+\\.styles$'],
          // NEW: V2
          [
            '^(i18n)',
            '^(openapi)',
            '^(routes)',
            '^(middlewares)',
            '^(db|schemas|lib)',
            '^(utils)',
            '^(types|constants)',
            '^(config)',
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

  // overrides: {
  //   jsonc: {
  //     // 'jsonc/sort-keys': ERROR,
  //     'node/prefer-global/process': OFF,
  //   },
  // },
});
