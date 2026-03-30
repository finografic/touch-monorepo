# Client — design system usage

How the Vite client wires **@finografic/design-system** and **Panda CSS** (`styled-system` output). Use this when imports or builds break after codegen or dependency changes.

## Two ways to import the same Panda output

| What | Example |
| --- | --- |
| **Generated folder** (no `@`) | `import { Flex } from 'styled-system/jsx'` |
| **Panda package alias** (with `@`) | `import { css } from '@styled-system/css'` |

Both resolve to the same codegen under `apps/client/styled-system/` (gitignored). The `@` form matches what `@finografic/design-system` **dist** bundles use internally, so it is easy to copy patterns from the DS repo.

Prefer **`@styled-system/recipes`** for recipe runtimes (see below).

## Why `tsconfig.json` paths *and* `vite.config.ts` aliases?

They are **not** duplicates for the same consumer:

- **`compilerOptions.paths` in `tsconfig.json`** — TypeScript, ESLint, and the IDE. Required for correct navigation and typechecking.
- **`resolve.alias` in Vite** — Rollup’s resolver. **`vite-tsconfig-paths`** applies your TS paths to **app source**, but imports such as `@styled-system/css` inside **linked** `node_modules/@finografic/design-system/dist/*.js` still need **explicit Vite aliases** or production builds fail with “failed to resolve @styled-system/css”.

Keep the **`@styled-system/css`**, **`@styled-system/jsx`**, and **`@styled-system/recipes`** entries **in sync** between `tsconfig.json` and `vite.config.ts`.

## Recipes: `@styled-system/recipes`

Panda codegen may not emit a `styled-system/recipes/` bundle. The client provides a small shim at `src/styled-system/recipes.ts` that re-exports design-system recipe runtimes (`button`, `table`, `callout`, `card`, …).

```ts
import { button, table } from '@styled-system/recipes';
```

## Regenerating Panda output

After changing Panda config or DS sources that affect styles:

```bash
cd apps/client && pnpm exec panda codegen && pnpm exec panda cssgen
```

(`pnpm build` / `pnpm dev` scripts already run both where needed.)

## Related files

| File | Role |
| --- | --- |
| `apps/client/panda.config.ts` | Panda `outdir`, `include`, preset |
| `apps/client/tsconfig.json` | `paths` for `styled-system` and `@styled-system/*` |
| `apps/client/vite.config.ts` | `resolve.alias` (including `@styled-system/*` and workspace packages) |
| `apps/client/src/styled-system/recipes.ts` | Recipe runtime shim |
| `apps/client/src/main.tsx` | Imports `styled-system/styles.css` |

## See also

- Monorepo workspace resolution: `docs/monorepos/WORKSPACE-RESOLUTION.md` (repo root)
- Design system package: `@finografic/design-system` (see its README and exports)
