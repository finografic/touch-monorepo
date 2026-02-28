# Server Build Configuration Guide

📅 Nov 19, 2025

## Overview

This document explains the server build configuration, particularly focusing on TypeScript compilation, path resolution, and handling of files outside the `src/` directory (specifically `env.server.ts`).

## Problem Summary

When `env.server.ts` was introduced at the root of `apps/server/`, it caused several build issues:

1. **TypeScript compilation errors**: Files outside `rootDir` couldn't be compiled
2. **Incorrect output paths**: Declarations were generated in the wrong location (`apps/dist/` instead of `apps/server/dist/`)
3. **Import resolution failures**: Client imports from `@workspace/server/types` were broken
4. **Bundler resolution errors**: `tsup` (esbuild) couldn't resolve `env.server` imports

## Root Cause

The core issue was that `env.server.ts` is located at the root of `apps/server/`, but TypeScript's `rootDir` is set to `./src`. This creates a conflict:

- **Before `env.server.ts`**: All source files were in `src/`, so `rootDir: "./src"` worked perfectly
- **After `env.server.ts`**: A file outside `rootDir` was imported, causing TypeScript to fail

## Solution Architecture

### 1. TypeScript Configuration (`tsconfig.json`)

**Key Settings:**

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "outDir": "./dist",
    "rootDir": "./src",
    "emitDeclarationOnly": true,
    "declaration": true,
    "paths": {
      "env.server": ["./env.server.d.ts"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.json"],
  "exclude": ["node_modules", "dist", "**/__tests__/**", "**/*.test.ts", "**/*.spec.ts", "./env.server.ts"]
}
```

**Why this works:**

- `rootDir: "./src"` strips the `src/` prefix from output (so `src/types/` → `dist/types/`)
- `outDir: "./dist"` outputs to `apps/server/dist/` (not `apps/dist/`)
- Path alias points to a shim file (`./env.server.d.ts`) instead of the root file
- `env.server.ts` is excluded from compilation

### 2. Shim File (`src/env.server.d.ts`)

**Location:** `apps/server/src/env.server.d.ts`

**Content:**

```typescript
// Type declarations for env.server.ts
// This file allows TypeScript to resolve the env.server import
// without trying to compile the actual env.server.ts file
// At runtime (tsx), this imports from the source file at the project root
// At compile time (tsc), TypeScript uses the types from the source file
export { env } from '../env.server';
```

**Purpose:**

- Provides type resolution for `env.server` imports
- Prevents TypeScript from trying to compile the root `env.server.ts` file
- Allows `rootDir: "./src"` to work correctly
- Works for both build (tsc) and dev (tsx) modes

**Important:** The import path is `../env.server` (one level up from `src/`), not `../../env.server.d`. This ensures:

- ✅ TypeScript can resolve types from the source file
- ✅ `tsx` (dev mode) can resolve the actual source file at runtime
- ✅ The path correctly points to `apps/server/env.server.ts`

### 3. Root Declaration File (`env.server.d.ts`)

**Location:** `apps/server/env.server.d.ts`

**Status:** ✅ **KEEP THIS FILE**

**Why:**

- Contains the actual type declarations for `env.server.ts`
- Required by the shim file (`src/env.server.d.ts`) to re-export types
- Should be committed to the repository
- If `env.server.ts` changes, regenerate it manually:

  ```bash
  cd apps/server
  pnpm exec tsc env.server.ts --declaration --emitDeclarationOnly --esModuleInterop
  ```

### 4. Bundler Configuration (`tsup.config.ts`)

**Key Settings:**

```typescript
export default defineConfig({
  format: ['esm'],
  dts: false, // Using tsc for types
  clean: true,
  target: 'ES2020',
  sourcemap: true,
  esbuildOptions(options) {
    // Configure esbuild to resolve env.server from the root
    options.alias = {
      ...options.alias,
      'env.server': './env.server.ts',
    };
    options.resolveExtensions = ['.ts', '.tsx', '.js', '.jsx'];
  },
  onSuccess: 'tsc --emitDeclarationOnly --declaration',
});
```

**Why this works:**

- `tsup` (esbuild) needs the actual source file (`.ts`) for bundling, not the declaration file
- The alias tells esbuild where to find `env.server.ts` at the project root
- TypeScript uses the shim file for type checking, esbuild uses the source file for bundling

### 5. Package.json Exports

**Key Exports:**

```json
{
  "exports": {
    "./types": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/types/index.js"
    },
    "./types/entities": {
      "types": "./dist/types/entities/index.d.ts",
      "import": "./dist/types/entities/index.js"
    },
    "./types/entities/*": {
      "types": "./dist/types/entities/*.d.ts",
      "import": "./dist/types/entities/*.js"
    }
  }
}
```

**Important:**

- Exports point to `./dist/types/...` (no `src/` prefix)
- This matches the output structure when `rootDir: "./src"` is used
- Client imports like `@workspace/server/types` resolve correctly

## Output Structure

### Correct Structure (After Fix)

```
apps/server/
├── dist/
│   ├── types/
│   │   ├── index.d.ts
│   │   └── entities/
│   │       ├── supported-language.entity.d.ts
│   │       └── ...
│   ├── index.js
│   └── ...
├── env.server.ts          (source file)
├── env.server.d.ts        (generated declarations - KEEP)
└── src/
    ├── env.server.d.ts    (shim file)
    └── ...
```

### Incorrect Structure (Before Fix)

```
apps/
├── dist/                  ❌ Wrong location
│   └── src/
│       └── types/         ❌ Has src/ prefix
└── server/
    └── dist/              (empty or incomplete)
```

## Key Principles

1. **`rootDir` determines output structure**
   - `rootDir: "."` → Output preserves full path: `dist/src/types/...`
   - `rootDir: "./src"` → Output strips `src/`: `dist/types/...`

2. **`outDir` determines output location**
   - `outDir: "./dist"` → Outputs to `apps/server/dist/`
   - `outDir: "../dist"` → Outputs to `apps/dist/` (sibling folder)

3. **Path aliases work differently for TypeScript vs Bundlers**
   - TypeScript: Uses `tsconfig.json` paths for type resolution
   - esbuild/tsup: Uses its own alias configuration in `tsup.config.ts`

4. **Files outside `rootDir` need special handling**
   - Use shim files for TypeScript type resolution
   - Use aliases for bundler resolution
   - Exclude from TypeScript compilation if they generate their own declarations

## Troubleshooting

### Issue: "File is not under 'rootDir'"

**Solution:** Create a shim file in `src/` that re-exports from the root declaration file

### Issue: "Could not resolve 'env.server'"

**Solution:** Add esbuild alias in `tsup.config.ts` pointing to the source file

### Issue: Client imports broken (`@workspace/server/types`)

**Solution:**

1. Check `outDir` is `"./dist"` (not `"../dist"`)
2. Check `rootDir` is `"./src"` (strips prefix)
3. Verify package.json exports match the output structure

### Issue: Declarations have `src/` prefix

**Solution:** Set `rootDir: "./src"` in `tsconfig.json`

### Issue: Declarations in wrong location

**Solution:** Set `outDir: "./dist"` in `tsconfig.json` (not `"../dist"`)

## Build Commands

```bash
# Build server (bundles code + generates declarations)
cd apps/server
pnpm run build

# Generate declarations only
pnpm exec tsc --emitDeclarationOnly --declaration --project tsconfig.json

# Regenerate env.server.d.ts if env.server.ts changes
pnpm exec tsc env.server.ts --declaration --emitDeclarationOnly --esModuleInterop
```

## Files to Keep

✅ **Keep these files:**

- `apps/server/env.server.d.ts` - Root declaration file (needed by shim)
- `apps/server/src/env.server.d.ts` - Shim file (needed for TypeScript resolution)
- `apps/server/env.server.ts` - Source file (needed for runtime)

## Related Files

- `apps/server/tsconfig.json` - TypeScript configuration
- `apps/server/tsup.config.ts` - Bundler configuration
- `apps/server/package.json` - Package exports and dependencies
- `apps/server/src/env.server.d.ts` - Type resolution shim
- `apps/server/env.server.d.ts` - Root declaration file

## Summary

The build configuration uses a **dual-path approach**:

1. **TypeScript** resolves `env.server` via a shim file (`src/env.server.d.ts`) for type checking
2. **esbuild/tsup** resolves `env.server` via an alias to the source file (`env.server.ts`) for bundling
3. **tsx (dev mode)** resolves `env.server` via the shim file, which imports from the source file

This allows:

- ✅ `rootDir: "./src"` to work (clean output structure)
- ✅ `outDir: "./dist"` to work (correct output location)
- ✅ Type checking to work (via shim)
- ✅ Bundling to work (via alias)
- ✅ Dev mode to work (tsx resolves via shim → source file)
- ✅ Client imports to work (correct package.json exports)

## Dev Mode Considerations

**Important for `tsx` (dev mode):**

- The shim file (`src/env.server.d.ts`) must import from the **source file** (`../env.server`), not the declaration file
- This is because `tsx` needs to execute the actual TypeScript source at runtime
- The path `../env.server` correctly resolves to `apps/server/env.server.ts` (one level up from `src/`)
- TypeScript still gets type information from the source file, so type checking works correctly

---

**Last Updated:** 2024-11-19
**Related Issues:** env.server.ts path resolution, TypeScript rootDir conflicts, build output structure
