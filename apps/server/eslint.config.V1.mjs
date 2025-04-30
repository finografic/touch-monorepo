import { ERROR, fino, IGNORES, INCLUDE_FILES_TS, OFF } from '@finografic/eslint-config';

export default fino({
  typescript: true,
  gitignore: true,
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  // plugins: {
  //   prettier: prettierPlugin,
  //   lodash: pluginLodash,
  //   import: pluginImport,
  // }
  files: [...INCLUDE_FILES_TS],
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
  },

  // overrides: {
  //   jsonc: {
  //     // 'jsonc/sort-keys': ERROR,
  //     'node/prefer-global/process': OFF,
  //   },
  // },
});
