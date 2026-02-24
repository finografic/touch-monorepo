import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig, type UserConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { envClient } from './env.client';
import { devCookieClearPlugin, logApiURL } from './vite.utils';

export default defineConfig(({ mode }: UserConfig): UserConfig => {
  const WORKSPACE_ROOT = resolve(__dirname, '../..');
  logApiURL({ mode });

  const isProd = mode === 'production';

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

      // Safe to run in prod too (no-op there)
      devCookieClearPlugin(),
    ].filter(Boolean),

    /**
     * IMPORTANT
     * Relative base is REQUIRED because the client is served
     * by the Hono server, not Vite preview.
     */
    base: './',

    /**
     * Dev server ONLY
     * (not used in production on the Pi)
     */
    server: {
      port: envClient.CLIENT_PORT ?? 3000,

      /**
       * CRITICAL:
       * - localhost breaks LAN access
       * - 0.0.0.0 exposes on all interfaces
       */
      host: '0.0.0.0',

      watch: {
        usePolling: true,
        interval: 1000,
      },

      /**
       * Proxy MUST use env, never hardcoded localhost
       */
      proxy: {
        '/api': {
          target: envClient.API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
      },

      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    },

    clearScreen: false,

    /**
     * This is the ONLY supported way to expose env
     * to the client in your architecture.
     *
     * DO NOT use import.meta.env here.
     */
    define: {
      global: 'window',
      'process.env': JSON.stringify({
        ...envClient,
        WORKSPACE_ROOT,
      }),
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.cjs', '.json'],
      alias: {
        '@workspace/core/types': resolve(WORKSPACE_ROOT, 'packages/core/src/types'),
        '@workspace/core/types/utils': resolve(WORKSPACE_ROOT, 'packages/core/src/types/utils'),
        '@workspace/i18n': resolve(WORKSPACE_ROOT, 'packages/i18n/src/index.ts'),
        '@workspace/i18n/generators': resolve(
          WORKSPACE_ROOT,
          'packages/i18n/src/generators/index.ts',
        ),
        '@workspace/shared': resolve(WORKSPACE_ROOT, 'packages/shared/src/index.ts'),
        '@workspace/shared/constants': resolve(
          WORKSPACE_ROOT,
          'packages/shared/src/constants/index.ts',
        ),
        'i18n/utils': resolve(__dirname, 'src/i18n/utils/index.ts'),
        messages: resolve(__dirname, '../messages'),
      },
    },

    build: {
      outDir: 'dist',
      emptyOutDir: true,
      copyPublicDir: true,
      reportCompressedSize: true,
      minify: 'esbuild',
      sourcemap: false,
      manifest: true,
      target: 'es2020',
      chunkSizeWarningLimit: 1000,

      rollupOptions: {
        external: [
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
              return 'vendor';
            }
          },
          entryFileNames: isProd ? 'app.js' : 'app.[hash].js',
          chunkFileNames: isProd ? '[name].js' : '[name].[hash].js',
          assetFileNames: isProd
            ? 'assets/[name].[ext]'
            : 'assets/[name].[hash].[ext]',
          sourcemapExcludeSources: true,
        },
      },
    },

    /**
     * Vite preview is NOT used on the Pi,
     * but keep it LAN-safe anyway.
     */
    preview: {
      port: 5000,
      host: '0.0.0.0',
    },

    optimizeDeps: {
      include: [
        'react/jsx-runtime',
        '@workspace/core',
        '@workspace/core/types',
        '@workspace/core/types/utils',
        '@workspace/i18n',
        '@workspace/shared',
        '@workspace/shared/constants',
        '@finografic/zustand-context-creator',
      ],
      esbuildOptions: {
        target: 'es2020',
      },
    },
  };
});
