import { ERROR, fino, IGNORES, INCLUDE_FILES_TS, OFF } from '@finografic/eslint-config';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default fino({
  typescript: true,
  gitignore: true,
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      log: 'readonly',
      getDotEnv: 'readonly',
      // React: true,
    },
  },
  overrides: {
    'jsonc': {
      'jsonc/sort-keys': ERROR,
    },
    'apps/client/**/*.{ts,tsx}': {
      languageOptions: {
        parser: '@typescript-eslint/parser',
        parserOptions: {
          project: './apps/client/tsconfig.json',
          tsconfigRootDir: __dirname,
        },
      },
    },
  },
  files: [...INCLUDE_FILES_TS],
  ignores: [...IGNORES],
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
    'ts/consistent-type-imports': [ERROR, { prefer: 'type-imports', fixStyle: 'separate-type-imports' }],
  },
  ignorePatterns: ['**/.inlang/**', '**/*.template'],
});
