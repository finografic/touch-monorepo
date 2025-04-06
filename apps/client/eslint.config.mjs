import { fino, IGNORES } from '@finografic/eslint-config';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default fino({
  ignores: IGNORES,
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  plugins: {
    'react': reactPlugin,
    'react-hooks': reactHooksPlugin,
  },
  rules: {
    'style/no-multi-spaces': OFF,
    'regexp/prefer-w': OFF,
  },
});
