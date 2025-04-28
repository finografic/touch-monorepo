import { ERROR, fino, GLOB_ESLINT_FILES, OFF } from '@finografic/eslint-config';

export default fino(
  {
    typescript: {
      parserOptions: {
        project: './tsconfig.base.json',
        tsconfigRootDir: '.',
      },
    },
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
    rules: {
      'node/prefer-global/process': OFF,
      'prefer-regex-literals': ERROR,
      'fino/top-level-function': OFF,
      'ts/consistent-type-imports': [
        ERROR,
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: true,
          fixStyle: 'separate-type-imports',
        },
      ],
      'ts/no-unused-vars': [
        ERROR,
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: [...GLOB_ESLINT_FILES],
    rules: {
      'ts/no-unused-vars': ERROR,
      'import/no-unresolved': ERROR,
      'import/no-unassigned-import': ERROR,
      'unused-imports/no-unused-imports': [ERROR],
    },
  },
  {
    files: ['apps/client/**/*'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'react': await import('eslint-plugin-react'),
      'react-hooks': await import('eslint-plugin-react-hooks'),
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react-hooks/rules-of-hooks': ERROR,
      'react-hooks/exhaustive-deps': ERROR,
      'react/prop-types': ERROR,
      // 'react/no-unknown-property': [ERROR, { ignore: ['css'] }],
      'react-dom/no-unknown-property': [ERROR, { ignore: ['css'] }],
      'react/jsx-uses-react': ERROR,
      'react/jsx-uses-vars': ERROR,
    },
  },
);
