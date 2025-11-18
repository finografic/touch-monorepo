import { ERROR, fino, OFF } from '@finografic/eslint-config';

export default fino({
  typescript: true,
  gitignore: true,
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      log: 'readonly',
      getDotEnv: 'readonly',
    },
  },
  // plugins: {
  //   prettier: prettierPlugin,
  // lodash: pluginLodash,
  // import: pluginImport,
  // },
  // files: [...INCLUDE_FILES_TS],
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
    'ts/no-unused-vars': OFF,
    'ts/no-undef': OFF,
    'no-unused-vars': OFF,
    'fino/top-level-function': OFF,
    // 'unicorn/number-literal-case': ERROR,
    // 'simple-import-sort/imports': [
    //   ERROR,
    //   {
    //     groups: [
    //       [
    //         // Side effect imports
    //         '^\\u0000',
    //         // `react`-> `@sage`packages ->`carbon-react`->`RTL`, then other packages in alphabetical order
    //         '^react',
    //         '^@sage',
    //         '^carbon-react',
    //         '^@testing-library',
    //         '^@',
    //         '^[a-z]',
    //         // Imports starting with `../`
    //         '^\\.\\.(?!/?$)',
    //         '^\\.\\./?$',
    //         // Imports starting with `./`
    //         '^\\./(?=.*/)(?!/?$)',
    //         '^\\.(?!/?$)',
    //         '^\\./?$',
    //       ],
    //     ],
    //   },
    // ],
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
  },

  // overrides: {
  //   jsonc: {
  //     // 'jsonc/sort-keys': ERROR,
  //     'node/prefer-global/process': OFF,
  //   },
  // },
});
