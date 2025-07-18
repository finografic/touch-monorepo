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
  //   lodash: pluginLodash,
  //   import: pluginImport,
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
  },

  // overrides: {
  //   jsonc: {
  //     // 'jsonc/sort-keys': ERROR,
  //     'node/prefer-global/process': OFF,
  //   },
  // },
});
