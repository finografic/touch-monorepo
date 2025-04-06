import { BREAKPOINTS } from 'styles/viewport/viewport.breakpoints';
import type { Config } from 'tailwindcss';
import type { BreakpointMap } from 'styles/viewport/viewport.types';
import colors from 'tailwindcss/colors';

export default {
  content: [
    './index.html',
    './src/**/*.{html,css}',
    './src/**/*.{html,js,jsx,ts,tsx}', // Ensure all your component files are included
    './node_modules/@radix-ui/react-*/**/*.js', // Include Radix UI components
    './node_modules/shadcn-ui/**/*.{js,jsx,ts,tsx}', // Include shadcn/ui components
  ],
  // transform: {
  //   tsx: (content) => content.replace(/[^]*/, ''), // Transform content before processing
  // },
  // extract: {
  //   tsx: (content) => content.match(/[^]*/g) || [], // Custom class extraction
  // },
  darkMode: 'class',
  // darkMode: 'media', // Use @media (prefers-color-scheme: dark)
  // prefix: 'tw-', // All classes will be prefixed: tw-flex, tw-p-4, etc.
  important: false, // Makes all utilities !important
  theme: {
    colors, // Use Tailwind's default colors
    extend: {
      // Only include utilities you need globally
      spacing: {
        // Your spacing scale
      },
    },
    screens: {
      // NOTE: Using consistent naming with our system
      sm: `${BREAKPOINTS.sm}px`,
      md: `${BREAKPOINTS.md}px`,
      lg: `${BREAKPOINTS.lg}px`,
      xl: `${BREAKPOINTS.xl}px`,
      xxl: `${BREAKPOINTS.xxl}px`, // Map 2xl value to xxl key
    } as const satisfies Required<Omit<BreakpointMap<string>, 'xs'>>,
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem', // Changed from 2xl to xxl for consistency
    },
    /*
    fontFamily: {
      sans: ['Your Font', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      serif: ['Your Serif Font', 'ui-serif', 'Georgia', 'serif'],
      mono: ['Your Mono Font', 'ui-monospace', 'monospace', 'monospace'],
    },
    */
  },
  // Only include the utilities you use frequently
  plugins: [
    require('@tailwindcss/forms'),
    /*
    // Add plugin to generate CSS variables
    function ({ addBase, theme }) {
      function extractColorVars(colorObj, colorGroup = '') {
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey];
          const cssVariable = colorGroup ? `--color-${colorGroup}-${colorKey}` : `--color-${colorKey}`;

          const newVars =
            typeof value === 'string' ? { [cssVariable]: value } : extractColorVars(value, colorKey);

          return { ...vars, ...newVars };
        }, {});
      }

      addBase({
        ':root': extractColorVars(theme('colors')),
      });
    },
    */
  ],
  // Advanced options
  future: {
    // Upcoming breaking changes you can opt into
  },
} satisfies Config;
