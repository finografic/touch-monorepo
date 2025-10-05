/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  // Standalone Vitest config (not inheriting from Vite to avoid CSS/PostCSS issues)
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'styles': resolve(__dirname, './src/styles'),
      'components': resolve(__dirname, './src/components'),
      'hooks': resolve(__dirname, './src/hooks'),
      'providers': resolve(__dirname, './src/providers'),
      'routes': resolve(__dirname, './src/routes'),
    },
  },
  // Explicitly disable CSS processing
  css: {
    modules: false,
    postcss: false,
  },
  // Don't load plugins that might cause issues
  plugins: [],
});
