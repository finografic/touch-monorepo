import { fino } from '@finografic/eslint-config';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default fino({
  plugins: {
    'react': reactPlugin,
    'react-hooks': reactHooksPlugin,
  },
});
