# Build Fix — Design System → Client

**Date:** 2026-03-14
**Symptom:** `@workspace/client#build` failed after the DS refactor. Multiple different errors appeared across rounds of attempted fixes, making the root cause hard to pin down.

---

## Root Cause Summary

Three separate but related issues, all stemming from how `tsdown` builds the design system package:

1. `unbundle: true` left internal path aliases unresolved in the dist output
2. `panda.preset` was being built with the wrong platform target
3. The `package.json` exports map declared `.mjs`/`.d.mts` extensions that no longer matched the actual build output

---

## Issue 1 — `@styled-system/css` / `@styled-system/jsx` unresolved in DS dist

**Error:**
```
Rollup failed to resolve import "@styled-system/css" from
"packages/design-system/dist/components-CtZs0EEX.js"
```

**Why it happened:**

`tsdown.config.ts` had `unbundle: true`. This mode transpiles source files individually (like `tsc`) rather than bundling entry points. It does **not** resolve `tsconfig.json` path aliases — it leaves them as-is in the output.

The DS uses `@styled-system/css` and `@styled-system/jsx` as path aliases (mapped in `tsconfig.json` to `./styled-system/css` and `./styled-system/jsx` — Panda's generated utilities). With `unbundle: true`, those alias strings appeared verbatim in the dist files. Vite, processing the DS dist during the client build, had no idea what `@styled-system/*` meant.

This was not a problem before the DS refactor because the older components did not import directly from `@styled-system/*`. The new Ark UI wrappers (Menu, Dialog, Popover, etc.) do.

**Fix — Part A:** Remove `unbundle: true` from `tsdown.config.ts` so tsdown bundles entry points, resolving all internal path aliases in the process.

**Fix — Part B:** Add aliases in `apps/client/vite.config.ts`:

```ts
'@styled-system/css': resolve(__dirname, 'styled-system/css'),
'@styled-system/jsx': resolve(__dirname, 'styled-system/jsx'),
```

This is the canonical Panda monorepo pattern. DS dist files that reference `@styled-system/*` get redirected to the **client's own** `styled-system/` output — so both share a single panda utility instance at runtime. The class names are guaranteed to match because the client's `panda.config.ts` uses the same `designSystemPreset`.

---

## Issue 2 — `panda.preset` bundled with wrong platform

**Error (from earlier rounds):**
```
createRequire is not exported by "__vite-browser-external"
```

**Why it happened:**

`panda.preset.ts` imports from `@pandacss/dev` — a Node.js package. It is consumed by `panda.config.ts` during build time (in Node), never in the browser. When tsdown bundled it with `platform: 'browser'` (the default), it tried to shim or strip Node-only APIs like `createRequire`, producing broken output that Vite then choked on.

**Fix:** Split `tsdown.config.ts` into two configs in an array:

```ts
export default defineConfig([
  {
    // All browser-facing entries
    entry: { 'index': '...', 'components/index': '...', ... },
    platform: 'browser',
    ...
  },
  {
    // Node-only entry — consumed by panda codegen, never shipped to browser
    entry: { 'panda.preset': 'src/panda.preset.ts' },
    platform: 'node',
    ...
  },
]);
```

---

## Issue 3 — `package.json` exports map had wrong file extensions

**Error:**
```
Rollup failed to resolve import "@workspace/design-system/components"
The module "./dist/components/index.mjs" was not found on the file system
```

**Why it happened:**

The `package.json` exports map declared `.mjs` / `.d.mts` extensions (e.g. `"import": "./dist/components/index.mjs"`). But tsdown in **bundle mode** (no `unbundle: true`) outputs `.js` / `.d.ts` for a package with `"type": "module"` — because in an ESM package, `.js` files are already treated as ESM modules, so `.mjs` is unnecessary.

The `panda.preset` node entry still correctly outputs `.mjs` / `.d.mts` (tsdown uses explicit extensions for Node platform targets).

**Fix:** Update all browser entry exports in `package.json` from `.mjs` → `.js` and `.d.mts` → `.d.ts`. Leave `panda.preset` as `.mjs` / `.d.mts`.

---

## Issue 4 — `Dialog` not exported from `@workspace/design-system/forms`

**Error:**
```
"Dialog" is not exported by "packages/design-system/dist/forms/index.js"
```

**Why it happened:**

During the DS refactor, `Dialog` was placed in `src/components/dialog/` and exported from `components/index.ts`. But client code (and the documented DS API) imports it from `@workspace/design-system/forms`.

**Fix:** Add a re-export to `src/forms/index.ts`:

```ts
export * from '../components/dialog';
export type { DialogContentPropsDS, DialogRootPropsDS, DialogSize } from '../components/dialog/dialog.types';
```

---

## Issue 5 — `Switch` (and other form components) imported from wrong DS sub-path

**Error:**
```
"Switch" is not exported by "packages/design-system/dist/components/index.js"
```

**Why it happened:**

After the DS refactor, some form components (`Switch`, and others) moved from `components/` to `forms/`. The client source files still imported them from `@workspace/design-system/components`.

**Fix:** Update client imports to use `@workspace/design-system/forms` for form components. Rule of thumb:
- `@workspace/design-system/components` — layout, feedback, and composition components (Button, Badge, Card, Tabs, Menu, Popover, Toast, Tooltip, DataTable, Spinner)
- `@workspace/design-system/forms` — all input/form components (Checkbox, Dialog, InputField, RadioGroup, Select, SelectSearchable, Slider, Switch)

---

## Files Changed

| File | Change |
| ---- | ------ |
| `packages/design-system/tsdown.config.ts` | Removed `unbundle: true`; split into browser + node configs |
| `packages/design-system/package.json` | Updated exports map extensions: `.mjs` → `.js`, `.d.mts` → `.d.ts` (browser entries only) |
| `packages/design-system/src/forms/index.ts` | Added `Dialog` re-export from `../components/dialog` |
| `apps/client/vite.config.ts` | Added `@styled-system/css` and `@styled-system/jsx` aliases → client `styled-system/` |
| `apps/client/src/**` | Updated form component imports from `components` → `forms` sub-path |
