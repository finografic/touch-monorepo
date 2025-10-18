import tailwindForms from '@tailwindcss/forms';
import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

import { BREAKPOINTS } from './src/styles/viewport/viewport.breakpoints';
import type { BreakpointMap } from './src/styles/viewport/viewport.types';

export default {
  content: [
    './index.html',
    './src/**/*.{html,css,js,jsx,ts,tsx}',
    './node_modules/@radix-ui/react-*/**/*.js',
  ],
  darkMode: 'class',
  theme: {
    colors,
    screens: {
      sm: `${BREAKPOINTS.sm}px`,
      md: `${BREAKPOINTS.md}px`,
      lg: `${BREAKPOINTS.lg}px`,
      xl: `${BREAKPOINTS.xl}px`,
      xxl: `${BREAKPOINTS.xxl}px`,
    } as const satisfies Required<Omit<BreakpointMap<string>, 'xs'>>,
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem',
    },
  },
  plugins: [tailwindForms],
} satisfies Config;
