# dprint → oxfmt Migration

## What changes

| Before                             | After                            |
| ---------------------------------- | -------------------------------- |
| `dprint` binary + WASM plugins     | `oxfmt` — single binary, no WASM |
| `@finografic/dprint-config`        | `@finografic/oxfmt` (this repo)  |
| `dprint.jsonc` per-package         | one `oxfmtrc.jsonc` at repo root |
| separate `malva` plugin for CSS    | built-in (CSS, SCSS, Less, etc.) |
| separate `markup_fmt` for HTML/JSX | built-in                         |
| `eslint-plugin-simple-import-sort` | built-in via `sortImports`       |

oxfmt matches Prettier's JS/TS output exactly — any diff is a bug.
Reformat commits are safe; no logic changes.

---

## Step 1 — Add oxfmt at the root

```jsonc
// package.json (root devDependencies)
"oxfmt": "^0.41.0"
```

Remove from `onlyBuiltDependencies`:

```diff
- "dprint",
```

## Step 2 — Add root config

Copy `packages/oxfmt/oxfmtrc.jsonc` to the repo root, or install
`@finografic/oxfmt` and reference it once oxfmt gains `extends` support.
For now, a flat copy is the pattern.

```sh
cp packages/oxfmt/oxfmtrc.jsonc oxfmtrc.jsonc
```

Add to `.gitignore` exclusions if needed (it shouldn't be ignored — commit it).

## Step 3 — Run the initial reformat

```sh
pnpm oxfmt
```

Review the diff. Expect whitespace-only changes. Commit as a standalone
formatting commit before continuing any feature work.

## Step 4 — Remove dprint from design-system

```sh
# packages/design-system/package.json
# remove: "@finografic/dprint-config": "0.12.4"
# remove: "format" and "format.check" scripts (or update — see below)

# delete the local config
rm packages/design-system/dprint.jsonc
```

Updated scripts for `packages/design-system/package.json`:

```json
"format":       "oxfmt",
"format.check": "oxfmt --check"
```

## Step 5 — Clean up ESLint prettier integration

**Remove** `eslint-plugin-prettier` — it runs the formatter as a lint rule,
which is now oxfmt's job. Replace with an `oxfmt --check` step in CI instead.

**Keep** `eslint-config-prettier` — it only _disables_ ESLint style rules that
would conflict with a formatter. It has no rules of its own and is still needed.

```sh
pnpm remove eslint-plugin-prettier -w
```

Also remove any `plugin:prettier/recommended` or `prettierPlugin` references
from `eslint.config.*`.

## Step 7 — Disable simple-import-sort in ESLint

oxfmt now owns import order via `sortImports`. Turn off the ESLint rules
to avoid conflicts (same issue the old dprint config noted):

```js
// eslint.config.*
"simple-import-sort/imports":  "off",
"simple-import-sort/exports": "off",
```

You can keep `eslint-plugin-simple-import-sort` installed but dormant, or
remove it once the oxfmt sort output looks right.

## Step 8 — Uninstall dprint

```sh
pnpm remove dprint @finografic/dprint-config --recursive
pnpm install
```

---

## Supported languages (no plugins needed)

JS, JSX, TS, TSX, JSON, JSONC, JSON5, YAML, TOML, HTML, CSS, SCSS, Less,
Markdown, MDX, GraphQL, Angular, Vue, Ember, Handlebars

## Excludes (add to oxfmtrc.jsonc)

```jsonc
"exclude": [
  "**/node_modules",
  "**/dist",
  "**/build",
  "**/*.d.ts",
  "packages/design-system/styled-system/**"
]
```
