# DS + Client Build Fixes — Debugging Log

**Date:** 2026-03-14
**Commits:** `947e0d6d`, `aead659f`, `1afc9c9f`
**Outcome:** First clean full-pipeline build (clean → install → build) and successful dev run since completing the Design System.

---

## Summary

The build failures were caused by a combination of five independent but interacting issues, all rooted in how `tsdown` builds the DS package and how the client consumes it. The problems surfaced together when everything was run from a fully clean state, making them difficult to isolate one by one.

---

## Fix 1 — `panda.config.ts`: Removed `watch: true`

**File:** `packages/design-system/panda.config.ts`

**What was wrong:**
`panda.config.ts` had `watch: true` in the config object. When the build script ran `panda codegen && tsdown`, Panda's codegen command honoured the `watch: true` flag and entered watch mode — running continuously and never exiting. This meant `tsdown` was never reached.

This was the same bug previously fixed in the client in commit `4bdaa180` (`fix(client): remove watch:true from panda.config — causes codegen/build to hang`). The DS had the same flag and was never fixed at the same time.

**The fix:**
Removed `watch: true` from `panda.config.ts`. The `watch` behaviour is only needed during `dev` (handled by `panda cssgen --watch`), not during the one-shot `build`.

---

## Fix 2 — `tsdown.config.ts`: Split browser + node configs; `panda.preset` separated

**File:** `packages/design-system/tsdown.config.ts`

**What was wrong:**
`panda.preset.ts` imports from `@pandacss/dev`, which is a Node.js-only package. When tsdown bundled `panda.preset` as part of the browser-platform config, it tried to shim or strip Node-only APIs (like `createRequire`), producing broken output. The symptom was:

```
createRequire is not exported by "__vite-browser-external"
```

**The fix:**
Split `tsdown.config.ts` into two configs in an array:

- **Browser config** — all component/token/form/grid/viewport entries with `platform: 'browser'`
- **Node config** — `panda.preset` entry alone with `platform: 'node'`

The `panda.preset` is consumed by `panda.config.ts` at codegen time (in Node), never shipped to the browser. Building it with the wrong platform target caused subtle runtime failures in the client.

`unbundle: true` was also retained — see Fix 3 for context on why this is the correct mode for the DS, and why it was briefly removed and then restored.

---

## Fix 3 — `package.json` exports map: `.mjs` → `.js`, `.d.mts` → `.d.ts`

**File:** `packages/design-system/package.json`

**What was wrong:**
The exports map declared `.mjs` / `.d.mts` file extensions for all browser entry points:

```json
"import": "./dist/components/index.mjs"
```

But tsdown with `unbundle: true` on a package with `"type": "module"` outputs `.js` / `.d.ts` — because in an ESM package, `.js` files are already treated as ESM modules, making `.mjs` redundant. The files on disk didn't match what the exports map declared, so resolution failed:

```
Rollup failed to resolve import "@workspace/design-system/components"
The module "./dist/components/index.mjs" was not found on the file system
```

**The fix:**
Updated all browser entry exports from `.mjs` → `.js` and `.d.mts` → `.d.ts`. The `panda.preset` node entry was left as `.mjs` / `.d.mts` because tsdown uses explicit ESM extensions for the node platform target.

Also added `_prepare: "panda codegen"` as a script alias for convenience (not used in the main build pipeline, but useful for manual regeneration).

---

## Fix 4 — `tsconfig.json`: Stripped bare path aliases, kept only `@styled-system/*`

**File:** `packages/design-system/tsconfig.json`

**What was wrong:**
The `paths` array had 11 entries mapping bare module aliases (e.g. `components/*`, `forms/*`, `types/*`) to `./src/` subdirectories. These were used throughout DS source files instead of relative imports. While TypeScript understood them, tsdown's `unbundle` mode does **not** resolve `tsconfig.json` path aliases — it transpiles files individually like `tsc`, leaving alias strings verbatim in the output. When Vite processed the DS `dist/` during the client build, it saw unresolvable bare imports like `types/recipes.types`.

**The fix:**

- Removed all bare-module path aliases
- Replaced them with relative imports throughout `src/` (`../../types/recipes.types`, etc.)
- Kept only `@styled-system/*` → `./styled-system/*` because that alias is also declared in the client's Vite config (see Fix 5), making it a shared contract rather than an internal shortcut

---

## Fix 5 — `vite.config.ts`: Added `@styled-system/*` aliases pointing to client's `styled-system/`

**File:** `apps/client/vite.config.ts`

**What was wrong:**
The DS dist files reference `@styled-system/css` and `@styled-system/jsx` (Panda utility imports). When Vite processed the DS dist during the client build, it had no idea what `@styled-system/*` referred to:

```
Rollup failed to resolve import "@styled-system/css" from
"packages/design-system/dist/components-CtZs0EEX.js"
```

The DS has its own `styled-system/` generated at build time, but at runtime the client should use **its own** `styled-system/` — not the DS's. This is the canonical Panda monorepo pattern: the consumer (client) runs its own `panda codegen` using the DS preset, and all Panda utility imports resolve to the consumer's output. This guarantees class names match because both use the same `designSystemPreset`.

**The fix:**
Added Vite aliases in the client:

```ts
'@styled-system/css': resolve(__dirname, 'styled-system/css'),
'@styled-system/jsx': resolve(__dirname, 'styled-system/jsx'),
```

This redirects any `@styled-system/*` import (whether from the client's own source or from DS dist files) to the client's local `styled-system/` output.

---

## Fix 6 — `src/index.ts`: Commented out `recipes` re-export

**File:** `packages/design-system/src/index.ts`

**What was wrong:**
The DS root `index.ts` re-exported `* from './recipes'`. The `recipes/` module exports all Panda `cva()`/`sva()` functions directly. Re-exporting these from the root caused TypeScript to produce a TS2590 error ("Expression produces a union type that is too complex to represent") when the client imported from `@workspace/design-system`. It also created potential ambiguity between recipe function exports and component exports that use the same names.

**The fix:**
Commented out `export * from './recipes'` in `src/index.ts`. Recipes are still accessible via the explicit `@workspace/design-system/recipes` sub-path export for consumers that need them directly.

---

## Fix 7 — `src/forms/index.ts`: Added `Dialog` re-export

**File:** `packages/design-system/src/forms/index.ts`

**What was wrong:**
`Dialog` was implemented in `src/components/dialog/` and exported from `@workspace/design-system/components`. But the documented DS API and existing client code imported it from `@workspace/design-system/forms`:

```
"Dialog" is not exported by "packages/design-system/dist/forms/index.js"
```

**The fix:**
Added a re-export in `src/forms/index.ts`:

```ts
export * from '../components/dialog';
export type { DialogContentPropsDS, DialogRootPropsDS, DialogSize } from '../components/dialog/dialog.types';
```

`Dialog` is now available from both sub-paths.

---

## Fix 8 — Client: Corrected DS sub-path imports

**Files:** Multiple client components

**What was wrong:**
Several client files were importing components from the wrong DS sub-path after the DS refactor reorganised what lives in `components/` vs `forms/`:

| File                         | Wrong import                                               | Correct import             |
| ---------------------------- | ---------------------------------------------------------- | -------------------------- |
| `GenericDialog.tsx`          | `Dialog` from `forms`, `Tabs` from `components` separately | Both from `components`     |
| `LanguageDeleteDialog.tsx`   | `Dialog` from `forms`                                      | `Dialog` from `components` |
| `LanguagesList.tsx`          | `Switch` (compound) from `components`                      | `SwitchField` from `forms` |
| `RelaysConnectionStatus.tsx` | `Switch` from `components`                                 | `Switch` from `forms`      |
| `AdminSlotsConfigPage.tsx`   | `Switch` from `components`                                 | `Switch` from `forms`      |
| `OrdersTable.columns.tsx`    | `ChecboxDS` from `components`                              | `ChecboxDS` from `forms`   |

**Rule of thumb established:**

- `@workspace/design-system/components` — layout, feedback, navigation, composition: Button, Badge, Card, Tabs, Menu, Popover, Toast, Tooltip, DataTable, Spinner, Dialog
- `@workspace/design-system/forms` — all input/form components: Checkbox, ChecboxDS, InputField, RadioGroup, Select, SelectSearchable, Slider, Switch, SwitchField

---

## Fix 9 — `turbo.json`: Removed `styled-system/**` from DS outputs

**File:** `turbo.json`

**What was wrong:**
`@workspace/design-system#build` had `"outputs": ["dist/**", "styled-system/**"]`. The DS's `styled-system/` is a **build-time intermediate artifact** — generated by `panda codegen` at the start of the build script, consumed by tsdown, and not shipped or consumed by downstream packages. Listing it as a turbo output caused turbo to try to cache and restore it, potentially interfering with incremental builds.

**The fix:**
Removed `styled-system/**` from DS build outputs. The `@workspace/client#build` correctly retains `"outputs": ["dist/**", "styled-system/**"]` because the client's `styled-system/` is a persistent artifact used during dev and testing.

---

## Debugging Artefacts (safe to delete)

These files were created during debugging and are not part of the final solution:

| File                                             | Purpose                                                                                          |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `packages/design-system/tsdown.config-V1.ts`     | Earlier single-config attempt with `platform: 'neutral'` and `@styled-system/*` in `neverBundle` |
| `packages/design-system/tsdown.config-V2-ERR.ts` | Split config without `unbundle: true` — caused `@styled-system/*` unresolved errors              |
| `packages/design-system/package-V1.json`         | Package snapshot before export map extension fix                                                 |
| `packages/design-system/package-V2-ERR.json`     | Package snapshot mid-debugging                                                                   |
| `TROUBLESHOOTING - ChatGPT.md`                   | Notes from external debugging session                                                            |
| `TROUBLESHOOTING - Claude.ai.md`                 | Notes from external debugging session                                                            |

---

## Root Cause Interaction Map

```
watch: true in panda.config
  └─► panda codegen never exits → tsdown never runs → styled-system/ never generated

tsdown: panda.preset bundled with platform: 'browser'
  └─► createRequire shim error at runtime in Vite

package.json exports: .mjs extensions
  └─► files don't exist on disk → Rollup can't resolve DS sub-paths

tsconfig paths (bare aliases) + tsdown unbundle mode
  └─► alias strings left verbatim in dist → Vite can't resolve types/recipes.types etc.

No @styled-system/* alias in client Vite config
  └─► DS dist imports @styled-system/css → Vite has no redirect → build fails
```

All five were required to be fixed simultaneously for a clean build to succeed.
