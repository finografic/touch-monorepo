# Workspace package resolution (client & server)

This document describes how `@workspace/*` packages are resolved and bundled for **client** and **server**, and what you must change when adding or using a new workspace package so deployment does not fail with `ERR_MODULE_NOT_FOUND`.

---

## Why this matters

Deployment output is a standalone folder (e.g. `dist/`) with no `packages/` tree. At runtime, Node (server) and the browser (client) cannot resolve `@workspace/shared` or any other `@workspace/*` name unless that code is **bundled into** the app. If a workspace package is left as an external import, you get:

- **Server:** `Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@workspace/...'`
- **Client:** Broken or missing code in the built assets.

Both client and server must be configured so every `@workspace/*` dependency is **inlined** into their build output.

---

## How the CLIENT resolves workspace packages (Vite)

**Config file:** `apps/client/vite.config.ts`

**Mechanism:**

1. **`resolve.alias`**
   Rewrites `@workspace/...` imports to real files under the monorepo (usually **source**, not `dist/`). That way Vite/Rollup see normal file paths and bundle that code into the client build.

2. **`optimizeDeps.include`**
   Lists those package names so Vite pre-bundles them (mainly for dev) and treats them as dependencies to process, not externals.

**Current workspace aliases (pattern to follow):**

- `@workspace/core/types` → `packages/core/src/types`
- `@workspace/core/types/utils` → `packages/core/src/types/utils`
- `@workspace/i18n` → `packages/i18n/src/index.ts`
- `@workspace/i18n/generators` → `packages/i18n/src/generators/index.ts`
- `@workspace/shared` → `packages/shared/src/index.ts`
- `@workspace/shared/constants` → `packages/shared/src/constants/index.ts`

**Required when the client uses a new `@workspace/foo` package:**

1. In `apps/client/vite.config.ts`:
   - Add **aliases** for the package and every **subpath** the client imports (e.g. `@workspace/foo`, `@workspace/foo/constants`), pointing to the **source** entry files (e.g. `packages/foo/src/index.ts`, `packages/foo/src/constants/index.ts`).
   - **Order matters:** list **more specific** aliases **first** (e.g. `@workspace/foo/constants` before `@workspace/foo`). Otherwise Vite can match the shorter alias and append the subpath to the file path (e.g. `index.ts/constants` → `ENOTDIR`).
   - Add the same package (and subpaths if used) to **`optimizeDeps.include`**.

If you add a new workspace package and use it in the client but **don’t** add aliases + `optimizeDeps.include`, the client may still work in dev (pnpm links the package) but the production build can miss or mis-resolve it.

---

## How the SERVER resolves workspace packages (tsup)

**Config file:** `apps/server/tsup.config.production.ts`

**Mechanism:**

- **`noExternal`**
  Lists package names that must **not** be treated as external. tsup (esbuild) will bundle them into the server output instead of leaving `import '@workspace/...'` in the built JS.

**Current workspace entries in `noExternal`:**

- `@workspace/core`
- `@workspace/i18n`
- `@workspace/shared`

**Required when the server uses a new `@workspace/foo` package:**

1. In `apps/server/tsup.config.production.ts`:
   - Add **`'@workspace/foo'`** (and any other `@workspace/*` names the server imports) to the **`noExternal`** array.

If you add a new workspace package and use it in the server but **don’t** add it to `noExternal`, the server bundle will still contain `import '@workspace/foo'`. In deployment there is no `node_modules/@workspace/foo`, so Node throws `ERR_MODULE_NOT_FOUND`.

---

## Deployment: no `@workspace/*` in the output

**Relevant code:** `packages/build-deployment/src/utils/package.utils.ts`

The deployment `package.json` is built from the **server** `package.json`. All dependencies whose names start with `@workspace/` are **removed** before writing the deployment `package.json`, because they are expected to be **bundled** into the server (and client) builds, not installed as separate packages in the deployment folder.

So:

- **Do not** add a `dist/shared` (or any `dist/@workspace/...`) folder in deployment.
- **Do** ensure every `@workspace/*` package used by server or client is configured for bundling as above.

---

## Checklist: adding a new `@workspace/*` package

When you introduce a new workspace package (e.g. `@workspace/foo`) and use it from client and/or server:

| Step | Where | What to do |
|------|--------|------------|
| 1 | `apps/client/vite.config.ts` | Add `resolve.alias` entries for `@workspace/foo` and any subpaths (e.g. `@workspace/foo/constants`) → source paths under `packages/foo/src/`. |
| 2 | `apps/client/vite.config.ts` | Add those same names to `optimizeDeps.include`. |
| 3 | `apps/server/tsup.config.production.ts` | Add `'@workspace/foo'` to the `noExternal` array. |
| 4 | Deployment | No change needed in `packages/build-deployment/`; it already strips all `@workspace/*` from the deployment `package.json`. |

If the new package is **only** used by the client, do steps 1–2 only. If **only** by the server, do step 3 only.

---

## Summary

| App    | Config file                          | Mechanism                                      |
|--------|--------------------------------------|------------------------------------------------|
| Client | `apps/client/vite.config.ts`          | `resolve.alias` + `optimizeDeps.include`       |
| Server | `apps/server/tsup.config.production.ts` | `noExternal`                                 |

Both ensure `@workspace/*` code is **bundled in**, so the deployment runs without a `packages/` tree and without `ERR_MODULE_NOT_FOUND`.
