import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig, type UserConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { envClient } from './env.client';
import { logApiURL } from './vite.utils';

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

      /**
       * Watch / HMR: Vite watches by default. If updates never reach the browser:
       * 1. Diagnostic: on save, does the terminal show "[vite] hmr update" or "page reload"?
       *    - Yes → watcher works; problem is HMR delivery (try server.hmr below).
       *    - No → watcher not firing (try polling, or clear node_modules/.vite and restart).
       * 2. With host: '0.0.0.0', the HMR WebSocket can fail when using a LAN URL; pinning
       *    hmr.host/clientPort forces the browser to connect to localhost.
       * 3. Polling (usePolling) is for WSL2/Docker/network drives; if you're on native
       *    macOS and watch used to work, try removing the watch block entirely.
       */
      // Uncomment if terminal shows HMR updates but browser never refreshes:
      // hmr: { host: 'localhost', port: envClient.CLIENT_PORT ?? 3000 },
      watch: {
        usePolling: true,
        interval: 500,
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
      // Force linked packages (pnpm link) to share a single instance of
      // React and Ark UI — prevents "invalid hook call" / multiple copies.
      dedupe: ['react', 'react-dom', '@ark-ui/react'],
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.cjs', '.json'],
      alias: {
        /**
         * Panda `@styled-system/*` — must match `compilerOptions.paths` in tsconfig.json.
         *
         * - TS/IDE: use tsconfig paths only.
         * - Vite/Rollup: keep these aliases too. `vite-tsconfig-paths` resolves paths for app
         *   source, but imports inside **linked** `@finografic/design-system/dist/*` still need
         *   explicit `resolve.alias` or the build fails with "failed to resolve @styled-system/css".
         */
        '@styled-system/css': resolve(__dirname, 'styled-system/css'),
        '@styled-system/jsx': resolve(__dirname, 'styled-system/jsx'),
        '@styled-system/recipes': resolve(__dirname, 'src/styled-system/recipes.ts'),
        '@workspace/core/types': resolve(WORKSPACE_ROOT, 'packages/core/src/types'),
        '@workspace/core/types/utils': resolve(WORKSPACE_ROOT, 'packages/core/src/types/utils'),
        '@workspace/i18n': resolve(WORKSPACE_ROOT, 'packages/i18n/src/index.ts'),
        '@workspace/i18n/generators': resolve(
          WORKSPACE_ROOT,
          'packages/i18n/src/generators/index.ts',
        ),
        // IMPORTANT: More specific first: /constants must match before bare @workspace/shared
        '@workspace/shared/constants': resolve(
          WORKSPACE_ROOT,
          'packages/shared/src/constants/index.ts',
        ),
        // IMPORTANT: More specific first: /constants must match before bare @workspace/shared
        '@workspace/shared': resolve(WORKSPACE_ROOT, 'packages/shared/src/index.ts'),
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
        external: ['node:fs', 'node:os', 'node:path', 'node:url', 'fs', 'os', 'path', 'url'],
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
          assetFileNames: isProd ? 'assets/[name].[ext]' : 'assets/[name].[hash].[ext]',
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
      // DS packages are pnpm-linked locals — exclude from pre-bundling so
      // Vite always reads from dist/ directly and picks up rebuilds immediately.
      exclude: [
        '@finografic/design-system',
        '@finografic/design-system/components',
        '@finografic/design-system/forms',
        '@finografic/design-system/grid',
        '@finografic/design-system/tokens',
        '@finografic/design-system/recipes',
        '@finografic/design-system/viewport',
      ],
      include: [
        'react/jsx-runtime',
        '@workspace/core',
        '@workspace/core/types',
        '@workspace/core/types/utils',
        '@workspace/i18n',
        '@workspace/shared',
        '@workspace/shared/constants',
        '@finografic/zustand-context-creator',
        '@finografic/icons',
      ],
      esbuildOptions: {
        target: 'es2020',
      },
    },
  };
});
