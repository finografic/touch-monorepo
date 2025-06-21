import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

export default defineConfig({
  // entry: ['src/index.ts'],
  format: ['cjs'], // CommonJS for Node.js
  dts: false, // Since we're using tsc for types
  clean: true, // Clean output directory
  target: 'ES2020', // Or your target Node version
  sourcemap: true, // Helpful for debugging
  env: {
    NODE_ENV: 'production',
  },
  onSuccess: 'tsc --emitDeclarationOnly --declaration',
} satisfies Options);
