import {
  ERROR,
  fino,
  // GLOB_ALL_SRC,
  GLOB_ESLINT_FILES,
  IGNORES,
  OFF,
} from '@finografic/eslint-config';

export default fino(
  {
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
    overrides: {
      jsonc: {
        'jsonc/sort-keys': ERROR,
      },
    },
    // files: [...GLOB_ALL_SRC],
    // ignores: [...IGNORES],
    rules: {
      'node/prefer-global/process': OFF,
      'prefer-regex-literals': ERROR,
      'fino/top-level-function': OFF,
      'ts/no-unused-vars': [
        ERROR,
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  }, // Second argument: file-specific config
  {
    files: [...GLOB_ESLINT_FILES],
    rules: {
      'ts/no-unused-vars': ERROR,
      'import/no-unresolved': ERROR,
      'import/no-unassigned-import': ERROR,
      'unused-imports/no-unused-imports': [ERROR],
      'unused-imports/no-unused-vars': [
        ERROR,
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
);
