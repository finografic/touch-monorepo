import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type UserConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { logApiURL } from './src/utils/vite.utils';
import { resolve } from 'path';

export default defineConfig(({ mode }: UserConfig): UserConfig => {
  const viteEnv = loadEnv(mode as string, process.cwd(), '');
  if (mode) logApiURL({ mode });

  // Resolve paths relative to workspace root
  const workspaceRoot = resolve(__dirname, '../..');

  // Set environment variables directly for Electron compatibility
  const envVars = {
    NODE_ENV: mode,
    API_PROTOCOL: 'http',
    API_HOST: 'localhost',
    API_PORT: '4040',
    API_BASE_PATH: '/api',
    API_URL: 'http://localhost:4040/api',
    CLIENT_PROTOCOL: 'http',
    CLIENT_HOST: 'localhost',
    CLIENT_PORT: '3000',
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
        '@workspace/i18n': resolve(workspaceRoot, 'packages/i18n/src'),
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
