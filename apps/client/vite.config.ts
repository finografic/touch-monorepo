import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type UserConfig } from 'vite';
import TurboConsole from 'unplugin-turbo-console/vite';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { logApiURL } from './src/utils/vite.utils';
import { envShared } from '@fino/config/envShared';

export default defineConfig(({ mode }: UserConfig): UserConfig => {
  const viteEnv = loadEnv(mode as string, process.cwd(), '');

  // NOTE: dev only.. log API URL that is being used
  if (mode) {
    logApiURL({ mode });
  }

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
      TurboConsole(),
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
    },
    build: {
      outDir: 'dist',
      emptyOutDir: false,
      copyPublicDir: true,
      reportCompressedSize: true,
      minify: true,
      sourcemap: true,
      manifest: true,
      target: 'modules',
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
      include: ['react/jsx-runtime', '@fino/config', '@fino/globals'],
      esbuildOptions: {
        target: 'es2020',
      },
    },
  };
});
