import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

export default defineConfig({
  format: ['esm'], // ESM for modern Node.js
  dts: false, // Since we're using tsc for types
  clean: true,
  target: 'ES2020',
  sourcemap: true,
  env: {
    NODE_ENV: 'production',
  },
  onSuccess: 'tsc --emitDeclarationOnly --declaration',
} satisfies Options);
