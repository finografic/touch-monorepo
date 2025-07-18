import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type UserConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { logApiURL } from './src/utils/vite.utils';
import { envShared } from '@workspace/config/envShared';
import { resolve } from 'path';

export default defineConfig(({ mode }: UserConfig): UserConfig => {
  const viteEnv = loadEnv(mode as string, process.cwd(), '');
  if (mode) logApiURL({ mode });

  // Resolve paths relative to workspace root
  const workspaceRoot = resolve(__dirname, '../..');

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
      port: envShared.CLIENT_PORT,
      host: envShared.CLIENT_HOST,
      watch: {
        usePolling: true,
        interval: 1000,
      },
    },
    clearScreen: false,
    define: {
      'global': 'window',
      'process.env': {
        ...envShared,
        NODE_ENV: mode,
        VITE_APP_NAME: viteEnv.VITE_APP_NAME,
      },
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.cjs', '.json'],
      alias: {
        '@workspace/core/types': resolve(workspaceRoot, 'packages/core/src/types'),
        '@workspace/core/types/utils': resolve(workspaceRoot, 'packages/core/src/types/utils'),
        '@workspace/i18n': resolve(workspaceRoot, 'packages/i18n/src'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: false,
      copyPublicDir: true,
      reportCompressedSize: true,
      minify: 'esbuild', // Use esbuild for faster minification
      sourcemap: false, // Disable sourcemaps in production to save memory
      manifest: true,
      target: 'modules',
      chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
      rollupOptions: {
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
        '@workspace/config',
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
