// Type declarations for env.server.ts
// This file allows TypeScript to resolve the env.server import
// without trying to compile the actual env.server.ts file
// At runtime (tsx), this imports from the source file at the project root
// At compile time (tsc), TypeScript uses the types from the source file
export { env } from '../env.server';

