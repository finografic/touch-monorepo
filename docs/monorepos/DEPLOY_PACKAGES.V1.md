## How the client bundles workspace packages (Vite)

The client uses **two mechanisms** so workspace code is bundled from source instead of left as external imports:

### 1. **`resolve.alias`**

Imports like `@workspace/core` and `@workspace/i18n` are rewritten to real source paths under the monorepo:

- `@workspace/core/types` → `packages/core/src/types`
- `@workspace/core/types/utils` → `packages/core/src/types/utils`
- `@workspace/i18n` → `packages/i18n/src/index.ts`
- `@workspace/i18n/generators` → `packages/i18n/src/generators/index.ts`

So Vite/Rollup see normal file paths and bundle that code into the client build.
No separate `packages/core` or `packages/i18n` folder is needed in the deployment.

### 2. **`optimizeDeps.include`**

Those same package names are listed in `optimizeDeps.include` so Vite pre-bundles them (mainly for dev).
That keeps behavior consistent and ensures they’re treated as dependencies to be processed, not left as external.

---

## Changes made for `@workspace/shared`

The same pattern is now used for `@workspace/shared` in **`apps/client/vite.config.ts`**:

- **Aliases**
  - `@workspace/shared` → `packages/shared/src/index.ts`
  - `@workspace/shared/constants` → `packages/shared/src/constants/index.ts`
- **optimizeDeps.include**
  - `@workspace/shared`
  - `@workspace/shared/constants`

So the client now bundles shared from source the same way it does for core and i18n,
and the deployment stays a single client bundle with no `dist/shared` folder.

**Note:** `ErrorMessage.tsx` imports `getErrorMessage` from `@workspace/shared/utils/api.utils`.
The shared package only has `src/index.ts` and `src/constants/`; it doesn’t export `utils/api.utils`.
If that import is in use, it may need to point at `@workspace/core` (where `api.utils` lives)
or shared needs to add that export. That’s separate from the Vite config changes above.
