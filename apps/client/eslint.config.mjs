// @ts-check
import { ERROR, fino, OFF } from '@finografic/eslint-config';

import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default fino({
  ignores: ['**/*.md', '**/*.mdx', '**/*.json', '**/*.jsonc'],
  plugins: {
    'simple-import-sort': simpleImportSort,
  },
  languageOptions: {
    ecmaVersion: 'latest',
    // sourceType: 'module',
    globals: {
      getDotEnv: 'readonly',
      log: 'readonly',
    },
  },
  // formatters: true,
  // react: true,
  // typescript: {
  //   parserOptions: {
  //     project: './tsconfig.json',
  //     parser: '@typescript-eslint/parser',
  //     tsconfigRootDir: __dirname,
  //   },
  // },

  formatters: true,
  typescript: true,
  rules: {
    'fino/top-level-function': OFF,
    'no-undef': [ERROR, { typeof: true }],
    'node/prefer-global/process': [ERROR, 'always'],
    'regexp/prefer-w': OFF,
    // 'style/jsx-one-expression-per-line': OFF,
    'style/jsx-curly-brace-presence': OFF,
    'style/no-multi-spaces': OFF,
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
  },
});
