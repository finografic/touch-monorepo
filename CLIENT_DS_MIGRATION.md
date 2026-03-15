# Client Migration — `@workspace/design-system` → `@finografic/design-system`

**Status:** Pending — `packages/design-system/` is still in the monorepo.
**Trigger:** Execute this plan after `@finografic/icons` and `@finografic/design-system`
are published to GitHub Packages and verified installable.

---

## Prerequisites

Before starting:

- [ ] `@finografic/icons` published to GitHub Packages and installable
- [ ] `@finografic/design-system` published to GitHub Packages and installable
- [ ] GitHub Packages auth token available (`NODE_AUTH_TOKEN` or `.npmrc` personal token)

---

## Step 1 — Configure GitHub Packages registry

Add to `apps/client/.npmrc` (or root `.npmrc` if not already present):

```ini
@finografic:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Verify the root `.npmrc` also has this if monorepo-wide config is used.

---

## Step 2 — Update `apps/client/package.json`

Remove workspace deps, add published versions:

```diff
- "@workspace/design-system": "workspace:*",
- "@workspace/icons": "workspace:*",
+ "@finografic/design-system": "^0.1.0",
+ "@finografic/icons": "^0.1.0",
```

Use the actual published versions (check GitHub Packages registry before setting).

---

## Step 3 — Update `apps/client/panda.config.ts`

Two changes needed:

```diff
- import { designSystemPreset } from '@workspace/design-system/panda.preset';
+ import { designSystemPreset } from '@finografic/design-system/panda.preset';

  include: [
    './src/**/*.{ts,tsx}',
-   './node_modules/@workspace/design-system/src/**/*.{ts,tsx}',
+   './node_modules/@finografic/design-system/src/**/*.{ts,tsx}',
  ],
```

---

## Step 4 — Update `turbo.json`

Remove `@workspace/design-system#build` from client's `dependsOn` — it is now an external
npm package, not a local workspace build:

```diff
  "@workspace/client#build": {
    "dependsOn": [
      "@workspace/core#build",
      "@workspace/shared#build",
      "@workspace/i18n#build",
      "@workspace/config#build",
      "@workspace/icons#build",
-     "@workspace/design-system#build"
    ],
```

Once `@workspace/icons` is also removed from the monorepo, remove `@workspace/icons#build` too.

---

## Step 5 — Bulk replace imports in `apps/client/src/`

**141 files** import from `@workspace/design-system`.
**45 files** import from `@workspace/icons`.

Use a single pass:

```bash
# @workspace/design-system → @finografic/design-system
find apps/client/src -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -exec perl -pi -e "s|@workspace/design-system|@finografic/design-system|g" {} +

# @workspace/icons → @finografic/icons
find apps/client/src -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -exec perl -pi -e "s|@workspace/icons|@finografic/icons|g" {} +
```

Also check for any remaining references in non-src files:

```bash
grep -r "@workspace/design-system\|@workspace/icons" apps/client/ \
  --include="*.ts" --include="*.tsx" --include="*.json" --include="*.css" \
  --exclude-dir=node_modules
```

---

## Step 6 — Update CSS imports in `apps/client/src/main.tsx` (or entry point)

These should already work since sub-path exports are identical, but verify:

```ts
// These import paths do not change — sub-paths are the same:
import '@finografic/design-system/styles/reset.css';
import '@finografic/design-system/styles/keyframes.css';
import '@finografic/design-system/styles/global.css';
import '@finografic/design-system/grid/grid.css';
import '@finografic/design-system/forms/forms.css';
```

---

## Step 7 — Verify `apps/client/vite.config.ts` aliases

These aliases must remain and point to the **client's own** `styled-system/`:

```ts
// These do NOT change — they redirect @styled-system/* in DS dist
// to the client's own panda-generated styled-system/
'@styled-system/css': resolve(__dirname, 'styled-system/css'),
'@styled-system/jsx': resolve(__dirname, 'styled-system/jsx'),
```

Remove any `@workspace/design-system` or `@workspace/icons` entries from the alias map.

---

## Step 8 — Install and rebuild

```bash
pnpm install
pnpm --filter @workspace/client build
```

If panda codegen fails, run manually first:
```bash
cd apps/client && pnpm panda codegen
```

---

## Step 9 — Typecheck

```bash
pnpm --filter @workspace/client typecheck
```

Expected: pre-existing ~91 TS errors from unrelated modules (relays, translations, auth) —
these should not increase. Any new errors will be import path mismatches to fix.

---

## Step 10 — Remove `packages/design-system/` from monorepo

Only after the client build and typecheck are clean:

```bash
# Remove from pnpm-workspace.yaml if listed explicitly
# Remove turbo.json @workspace/design-system#build task entry entirely
# git rm -r packages/design-system/
```

Update `turbo.json` to remove the `@workspace/design-system#build` task definition block.

---

## Known Risks / Watch Points

| Area | Risk | Mitigation |
| ---- | ---- | ---------- |
| panda.config `include` | DS dist ships `.js` not `.ts` — Panda may not scan it for used class names | Already handled: include points to `src/**` in DS dist; verify `files` in DS package.json includes `src/` |
| `styled-system/` sharing | DS and client must share one Panda instance | Vite aliases (Step 7) ensure this — do not remove them |
| `@finografic/icons` version | DS was built against a specific icons version | Use the same version in client as DS depends on |
| CSS import order | Reset/keyframes must load before component CSS | Same order as before — no change needed |
| Token imports | Client may import `colors`, `spacing` etc. from `@workspace/design-system/tokens` | Covered by Step 5 bulk replace |

---

## Sub-path Import Reference (unchanged names, new scope)

| Old | New |
| --- | --- |
| `@workspace/design-system` | `@finografic/design-system` |
| `@workspace/design-system/components` | `@finografic/design-system/components` |
| `@workspace/design-system/forms` | `@finografic/design-system/forms` |
| `@workspace/design-system/grid` | `@finografic/design-system/grid` |
| `@workspace/design-system/tokens` | `@finografic/design-system/tokens` |
| `@workspace/design-system/recipes` | `@finografic/design-system/recipes` |
| `@workspace/design-system/panda.preset` | `@finografic/design-system/panda.preset` |
| `@workspace/icons` | `@finografic/icons` |
