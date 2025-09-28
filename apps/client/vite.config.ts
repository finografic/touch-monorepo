import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type UserConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { logApiURL } from './src/utils/vite.utils';
import { resolve } from 'path';
import { envShared } from '../../env.shared.js';

export default defineConfig(({ mode }: UserConfig): UserConfig => {
  const viteEnv = loadEnv(mode as string, process.cwd(), '');
  if (mode) logApiURL({ mode });

  // Resolve paths relative to workspace root
  const workspaceRoot = resolve(__dirname, '../..');

  // Load environment variables from shared env configuration
  const envVars = {
    NODE_ENV: envShared.NODE_ENV,
    API_PROTOCOL: envShared.API_PROTOCOL,
    API_HOST: envShared.API_HOST,
    API_PORT: String(envShared.API_PORT),
    API_BASE_PATH: envShared.API_BASE_PATH,
    API_URL: envShared.API_URL,
    API_BASE_URL: envShared.API_BASE_URL,
    CLIENT_PROTOCOL: envShared.CLIENT_PROTOCOL,
    CLIENT_HOST: envShared.CLIENT_HOST,
    CLIENT_PORT: String(envShared.CLIENT_PORT),
    CLIENT_ORIGIN: envShared.CLIENT_ORIGIN,
    VITE_APP_NAME: viteEnv.VITE_APP_NAME,
  };

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
    ],
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
    },
    clearScreen: false,
    define: {
      'global': 'window',
      'process.env': envVars,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.cjs', '.json'],
      alias: {
        '@workspace/core/types': resolve(workspaceRoot, 'packages/core/src/types'),
        '@workspace/core/types/utils': resolve(workspaceRoot, 'packages/core/src/types/utils'),
        '@workspace/i18n': resolve(workspaceRoot, 'packages/i18n/src/index.ts'),
        '@workspace/i18n/generators': resolve(workspaceRoot, 'packages/i18n/src/generators'),
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
          'node:path',
          'fs',
          'path',
          'node:os',
          'os',
          'src/apps/client/src/components/ButtonRadix/radix-source-files/**/*',
          'src/apps/client/src/components/ButtonV1/**/*',
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
          entryFileNames: 'app.js',
          chunkFileNames: '[name].js',
          assetFileNames: 'assets/[name].[ext]',
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
      ],
      esbuildOptions: {
        target: 'es2020',
      },
    },
  };
});
