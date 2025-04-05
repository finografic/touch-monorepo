// import tailwindcss from '@tailwindcss/vite/postcss';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import nesting from 'postcss-nesting';
import purgecss from '@fullhuman/postcss-purgecss';
import radixColors from './src/styles/radix-ui/radix.variables';

export default {
  plugins: {
    'postcss-import': {},
    'postcss-radix-colors': radixColors(),
    // 'tailwindcss/nesting': {},
    // tailwindcss: {},
    'autoprefixer': {},
    ...(process.env.NODE_ENV === 'production'
      ? {
          '@fullhuman/postcss-purgecss': {
            content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
            defaultExtractor: (content) => {
              // Capture as much as possible, including Tailwind classes, CSS variables, etc.
              const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
              const broadMatchesWithoutTrailingSlash = broadMatches.map((match) => match.replace(/\\$/, ''));

              // Capture CSS variables specifically (both definition and usage)
              const cssVariableMatches = content.match(/--[a-z0-9-_]+/gi) || [];

              return [...broadMatchesWithoutTrailingSlash, ...cssVariableMatches];
            },
            safelist: {
              standard: [
                /^var\(--/, // CSS variable usage
                /^--/, // CSS variable definitions
                /^tw-/, // Tailwind classes with prefix
                /^:root/, // Root selector
                /^html/, // HTML selector
                /^body/, // Body selector
              ],
              deep: [
                /radix-/, // Radix UI specific classes and attributes
                /data-/, // Data attributes used by Radix UI
                /aria-/, // Aria attributes
                /^:?(hover|focus|active|disabled|checked|selected|before|after)/, // Common pseudo-classes and elements
              ],
              greedy: [
                /^(gray|grey|mauve|slate)-/, // Color utility classes
                /^(bg|text|border)-/, // Common utility prefixes
              ],
            },
            // Skip keyframes, CSS variables declarations, and font-face rules
            skippedContentGlobs: ['**/*.{css}'],
            variables: true, // Enable CSS variable handling
            keyframes: true, // Preserve keyframes
            fontFace: true, // Preserve font-face rules
          },
        }
      : {}),
  },
};
