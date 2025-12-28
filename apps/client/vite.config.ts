import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig, type UserConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { envClient } from './env.client';
import { devCookieClearPlugin, logApiURL } from './vite.utils';

export default defineConfig(({ mode }: UserConfig): UserConfig => {
  const WORKSPACE_ROOT = resolve(__dirname, '../..');
  // const viteEnv = loadEnv(mode as string, process.cwd(), '');
  logApiURL({ mode });

  return {
    css: {
      transformer: 'lightningcss',
    },
    plugins: [
      tsconfigPaths({
        projects: ['./tsconfig.vite.json'],
      }),
      react({
        include: ['**/*.tsx', '**/*.ts'],
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
      tailwindcss(),
      // mode === 'development' && devCookieClearPlugin(),
      devCookieClearPlugin(),
    ].filter(Boolean),
    base: './',
    server: {
      port: 3000,
      host: 'localhost',
      watch: {
        usePolling: true,
        interval: 1000,
      },
      proxy: {
        '/api': 'http://localhost:4040',
      },
      // Cache busting for development
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    },
    clearScreen: false,
    define: {
      'global': 'window',
      'process.env': JSON.stringify({ ...envClient, WORKSPACE_ROOT }),
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.cjs', '.json'],
      alias: {
        '@workspace/core/types': resolve(WORKSPACE_ROOT, 'packages/core/src/types'),
        '@workspace/core/types/utils': resolve(WORKSPACE_ROOT, 'packages/core/src/types/utils'),
        '@workspace/i18n': resolve(WORKSPACE_ROOT, 'packages/i18n/src/index.ts'),
        '@workspace/i18n/generators': resolve(WORKSPACE_ROOT, 'packages/i18n/src/generators/index.ts'),
        'i18n/utils': resolve(__dirname, 'src/i18n/utils/index.ts'),
        'i18n/messages.js': resolve(__dirname, 'src/i18n/messages/messages.js'),
        'i18n/runtime.js': resolve(__dirname, 'src/i18n/messages/runtime.js'),
        'messages': resolve(__dirname, '../messages'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true, // Changed from false to true to clean the directory
      copyPublicDir: true,
      reportCompressedSize: true,
      minify: 'esbuild', // Use esbuild for faster minification
      sourcemap: false, // Disable sourcemaps in production to save memory
      manifest: true,
      target: 'es2020',
      chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
      rollupOptions: {
        external: [
          // Explicitly exclude Node.js modules from browser builds
          'node:fs',
          'node:os',
          'node:path',
          'node:url',
          'fs',
          'os',
          'path',
          'url',
        ],
        output: {
          format: 'es',
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('node_modules/lodash')) {
                return 'lodash';
              }
              // Default vendor chunk for other node_modules
              return 'vendor';
            }
          },
          entryFileNames: mode === 'development' ? 'app.[hash].js' : 'app.js',
          chunkFileNames: mode === 'development' ? '[name].[hash].js' : '[name].js',
          assetFileNames: mode === 'development' ? 'assets/[name].[hash].[ext]' : 'assets/[name].[ext]',
          sourcemapExcludeSources: true,
        },
      },
    },
    preview: {
      port: 5000,
      host: 'localhost',
    },
    optimizeDeps: {
      include: [
        'react/jsx-runtime',
        '@workspace/core',
        '@workspace/core/types',
        '@workspace/core/types/utils',
        '@workspace/i18n',
        '@finografic/zustand-context-creator',
      ],
      esbuildOptions: {
        target: 'es2020',
      },
    },
  };
});
