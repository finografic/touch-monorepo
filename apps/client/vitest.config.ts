/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['src/test/setup.ts'],
    css: true,
    globals: true,
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    coverage: {
      // optional
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: 'coverage',
    },
    // thread & isolation tuning if needed:
    // isolate: true,
    // threads: true,
  },
  resolve: {
    alias: {
      styles: resolve(__dirname, './src/styles'),
      components: resolve(__dirname, './src/components'),
      hooks: resolve(__dirname, './src/hooks'),
      providers: resolve(__dirname, './src/providers'),
      routes: resolve(__dirname, './src/routes'),
    },
  },
  plugins: [],
});
