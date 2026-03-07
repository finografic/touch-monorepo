# `@workspace/icons`

Curated icon registry for the Finografic design system.

Wraps [Lucide React](https://lucide.dev/) with a thin layer that applies consistent class names, a `data-icon-name` attribute, and a forwarded ref — then exports every selected icon as a named, strongly-typed component.

The icon selection is managed by a local **picker UI** ([`@finografic/lucide-manager`](https://github.com/finografic/lucide-manager)) that talks to a minimal **Hono server** that lives inside this package. All codegen logic is also local — no generator code is shipped inside the npm dependency.

---

## File Tree

```
packages/icons/
├── src/
│   ├── icons.json            ← source of truth — edited via the picker UI, committed to git
│   ├── icons.ts              ← GENERATED — do not edit by hand
│   ├── icons.utils.ts        ← createIconWrapper factory (class, ref, data-attr)
│   └── index.ts              ← GENERATED — named exports + re-exports
│
├── server/
│   └── icons-server.ts       ← Hono server: GET + POST /api/icons-json
│                                Reads/writes src/icons.json, triggers codegen on save
│
├── scripts/
│   └── generate.ts           ← Codegen: icons.json → icons.ts + index.ts
│
├── lucide-manager.config.json  ← Config read by the picker UI (server URL, icons path)
├── package.json
├── tsconfig.json
└── tsdown.config.ts
```

---

## How it works

### The data model

`src/icons.json` is the single source of truth. It is an array of entries that map a Lucide icon (by its kebab-case name) to a project-specific export alias:

```json
[
  { "lucideName": "plus",          "exportName": "Add"        },
  { "lucideName": "triangle-alert","exportName": "ExclamationTriangle" },
  { "lucideName": "loader",        "exportName": "Loader"     }
]
```

`exportName` becomes the public API name — consumers import `AddIcon`, `ExclamationTriangleIcon`, etc. (the `Icon` suffix is appended automatically by the generator).

### The generator (`scripts/generate.ts`)

Reads `src/icons.json` and emits two files:

- **`src/icons.ts`** — builds the `ICONS` map (exportName → Lucide component), auto-wraps every icon with `createIconWrapper`, and exports `icons`, `IconName`, `ICON_NAMES`, and `IconComponent`.
- **`src/index.ts`** — destructures `icons` into individual named exports (`export const { AddIcon, ... } = icons`) plus re-exports `createIconWrapper` and `IconProps`.

Both files carry a `!! GENERATED FILE` header. The generator is pure TypeScript with no external dependencies beyond Node's `fs`.

### The server (`server/icons-server.ts`)

A minimal [Hono](https://hono.dev/) HTTP server with two routes:

```
GET  /api/icons-json   → reads src/icons.json, returns JSON array
POST /api/icons-json   → validates + writes JSON array to src/icons.json,
                         then runs the generator in-process
```

The server starts on a configurable port (default `3001`) and is only ever run locally during development — it is not part of the package's build output or published files.

Running `pnpm icons` starts the server and opens the picker UI in the browser.

### The picker UI (`@finografic/lucide-manager`)

The `@finografic/lucide-manager` npm package (v2.x — see below) is a **React SPA** — a browser-based icon browser and selection tool. In the simplified version it contains only the UI:

- **No Vite plugin** — the server coupling is gone
- **No codegen script** — that lives locally in this package
- **No server code** — it only knows how to make REST calls

The picker reads the server URL from `lucide-manager.config.json` (or falls back to `http://localhost:3001`). It fetches the current `icons.json` on load, renders the full Lucide catalogue with search and category filters, and posts the updated selection back to the server on every toggle or rename.

```jsonc
// lucide-manager.config.json
{
  "iconsJsonPath": "./src/icons.json",   // used by the local server + generator
  "serverUrl":    "http://localhost:3001" // used by the picker UI
}
```

---

## Developer workflow

```bash
# Start the picker UI + local Hono server
pnpm icons

# Re-run codegen manually (no server needed)
pnpm icons.generate

# Build the package for consumption by other workspace packages
pnpm build
```

1. Run `pnpm icons` → server starts on `:3001`, picker opens in the browser.
2. Browse or search the full Lucide catalogue.
3. Click an icon to add/remove it from the registry. Optionally rename the export alias.
4. On each change the picker POSTs to the server → `icons.json` is updated → codegen runs → `icons.ts` and `index.ts` are regenerated in place.
5. Commit `icons.json` (source of truth). The generated files are also committed so consumers work without running the server.

---

## Package API

```ts
import { AddIcon, TrashIcon, LoaderIcon } from '@workspace/icons';
import { icons, ICON_NAMES }              from '@workspace/icons';
import type { IconName, IconComponent }   from '@workspace/icons';

// createIconWrapper — wrap any Lucide (or SVG) component with DS conventions
import { createIconWrapper } from '@workspace/icons';
import type { IconProps }    from '@workspace/icons';
```

Every exported icon component:
- Accepts all `SVGProps<SVGSVGElement>` plus any `data-*` attribute
- Always carries `.icon` and `.icon-name--{kebab}` CSS classes
- Exposes `data-icon-name="{kebab}"` for CSS targeting and debugging
- Forwards its ref to the underlying `<svg>` element

---

## `@finografic/lucide-manager` v2.x — what changes

The current v0.4.0 package bundles the Vite dev server plugin, the codegen script, and the picker UI together. The next version separates these concerns:

| Concern | v0.4.x | v2.x |
|---|---|---|
| Picker UI (React SPA) | ✅ inside package | ✅ inside package |
| Server (reads/writes icons.json) | Vite middleware plugin | ❌ removed — local Hono server |
| Codegen (icons.json → icons.ts) | `scripts/generate-icons-ts.ts` | ❌ removed — local `scripts/generate.ts` |
| Config loading | walks CWD for `lucide-manager.config.json` | reads `serverUrl` from config or env |

The published package becomes **UI only**: a deployable/runnable React app that talks to whatever server URL is pointed at it. The local `packages/icons/` package owns the server and the generator — they are project-specific and don't belong in an npm dependency.

The `lucide-manager` CLI binary is retained but simplified:

```bash
lucide-manager dev       # serve the picker UI (static, points to serverUrl in config)
lucide-manager generate  # deprecated — use local pnpm icons.generate instead
```

---

## Dependencies

| Package | Role |
|---|---|
| `lucide-react` | Icon components (runtime dep — tree-shaken by consumers) |
| `@finografic/lucide-manager` | Picker UI — dev only, not in build output |
| `hono` | Local dev server — dev only |
| `tsx` | Run server + scripts without a build step |
| `tsdown` | Build the package for workspace consumers |
