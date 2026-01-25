# Fetch Client Refactoring - Summary

**Date:** December 21, 2025
**Status:** ✅ Code Complete - Needs Build & Commit

---

## ✅ Completed Changes

### 1. **Removed Unused Imports** (`apps/client/src/api/fetch.client.ts`)

- ❌ Removed `ErrorResponse` (unused)
- ❌ Removed `ERROR_CODES` (unused)
- ✅ Kept `ERROR_MESSAGES` (used on line ~197)

### 2. **Created New Shared Types** (`packages/core/src/api/fetch.types.ts`)

**NEW FILE** with framework-agnostic fetch types:

- `FetchRequestConfig` - Request configuration interface
- `FetchResponse<T>` - Normalized response interface
- `FetchError` - Custom error class

### 3. **Migrated Utilities** (`packages/core/src/api/fetch.utils.ts`)

Added shared utilities from `fetch.client.ts`:

- `buildUrl()` - URL builder with query params
- `normalizeResponse()` - Response normalizer
- `isRetryableError()` - **Consolidated** (removed duplicate, enhanced to include 408 status)

### 4. **Cleaned Up api.types.ts** (`packages/core/src/api/api.types.ts`)

- ❌ Deleted outdated `ApiResponse<T>` interface (no longer used)
- ❌ Deleted `ApiResponse_DEV<T>` interface (no longer used)
- ✅ File now minimal with clear comments pointing to specific type modules

### 5. **Updated fetch.client.ts** (`apps/client/src/api/fetch.client.ts`)

- ✅ Imports from `@workspace/core/api`: `buildUrl`, `normalizeResponse`, `isRetryableError`, `ERROR_MESSAGES`, `FetchError`, `FetchRequestConfig`, `FetchResponse`
- ❌ Removed local implementations (moved to core package)
- ✅ Kept app-specific code: `request()`, `api` object, `createTimeout()`

### 6. **Updated Package Exports**

- ✅ `packages/core/src/api/index.ts` - Added `export * from './fetch.types'`
- ✅ `packages/core/tsup.config.ts` - Added `'src/api/fetch.types.ts'` to entry array

---

## 📋 What Stays in `fetch.client.ts`

| Function | Reason |
|----------|--------|
| `request()` | App-specific (uses `process.env.API_URL`) |
| `api` object | App-specific wrapper around `request()` |
| `createTimeout()` | Internal helper for `request()` |

---

## 📦 What Moved to `@workspace/core/api`

| Item | Location | Reusable |
|------|----------|----------|
| `FetchError` | `fetch.types.ts` | ✅ Yes |
| `FetchRequestConfig` | `fetch.types.ts` | ✅ Yes |
| `FetchResponse<T>` | `fetch.types.ts` | ✅ Yes |
| `buildUrl()` | `fetch.utils.ts` | ✅ Yes |
| `normalizeResponse()` | `fetch.utils.ts` | ✅ Yes |
| `isRetryableError()` | `fetch.utils.ts` | ✅ Yes (consolidated) |

---

## 🚀 Next Steps (Manual)

### 1. Rebuild @workspace/core Package

```bash
cd /Users/justin/repos-finografic/touch-monorepo/packages/core
pnpm build
```

**Expected output:** `dist/api/fetch.types.js` and `dist/api/fetch.types.d.ts` should be created.

### 2. Verify Build Success

```bash
ls -la packages/core/dist/api/fetch.types.*
```

Should show:

- `fetch.types.js`
- `fetch.types.d.ts`

### 3. Test in Client

The client app should now compile without errors since all imports are from `@workspace/core/api`.

### 4. Commit Changes

```bash
git add -A
git commit -m "refactor(api): migrate fetch types and utils to @workspace/core

Fetch Client Refactoring:
────────────────────────────────────────────────────────────
Move reusable fetch utilities and types from client to workspace core package
for better code reuse across applications.

New Files (@workspace/core):
- packages/core/src/api/fetch.types.ts
  → FetchRequestConfig, FetchResponse<T>, FetchError

Updated Files (@workspace/core):
- packages/core/src/api/fetch.utils.ts
  → Added buildUrl(), normalizeResponse()
  → Consolidated isRetryableError() (now includes 408 status)
- packages/core/src/api/api.types.ts
  → Removed outdated ApiResponse interfaces
- packages/core/src/api/index.ts
  → Export fetch.types
- packages/core/tsup.config.ts
  → Added fetch.types.ts to entry array

Updated Files (apps/client):
- apps/client/src/api/fetch.client.ts
  → Import types and utils from @workspace/core/api
  → Removed local implementations
  → Kept app-specific code (request, api object)
  → Removed unused imports (ErrorResponse, ERROR_CODES)

Benefits:
✓ Reusable fetch types across applications
✓ Consolidated error retry logic
✓ Smaller client bundle
✓ Clear separation: app-specific vs reusable code

Zero linter errors."
```

---

## 📊 File Changes Summary

### Modified Files (7)

1. `apps/client/src/api/fetch.client.ts` - Imports from core, removed duplicates
2. `packages/core/src/api/fetch.types.ts` - **NEW** - Shared types
3. `packages/core/src/api/fetch.utils.ts` - Added utilities
4. `packages/core/src/api/api.types.ts` - Cleaned up
5. `packages/core/src/api/index.ts` - Export fetch.types
6. `packages/core/tsup.config.ts` - Added build entry
7. `packages/core/package.json` - No changes needed (wildcard exports cover it)

### Zero Linter Errors ✅

---

## 🎯 Architecture Benefits

1. **Code Reuse**: Fetch utilities now available to all workspace apps
2. **Maintainability**: Single source of truth for fetch types
3. **Bundle Size**: Client app imports pre-built utilities
4. **Type Safety**: Shared types ensure consistency
5. **Testability**: Pure utilities easier to test in isolation

---

**Status:** Ready to build and commit! 🚀
