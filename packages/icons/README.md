# `@workspace/icons`

Curated icon registry for the Finografic design system.

Wraps [Lucide React](https://lucide.dev/) with a thin layer that applies
consistent class names, a `data-icon-name` attribute, and a forwarded ref —
then exports every selected icon as a named, strongly-typed component.

Icon selection is managed by a local **picker UI**
([`@finografic/lucide-manager`](https://github.com/finografic/lucide-manager))
that talks to a minimal **Hono server** that lives in this package.
All codegen logic is also local — nothing is shipped inside the npm dependency.

---

## Context — how we got here

The icon registry started as part of `@workspace/design-system`. It was
extracted into this standalone package for two reasons:

1. Icons are an independently versioned concern — icon changes should not
   require a DS rebuild or release.
2. The picker tool and codegen scripts are operational concerns that don't
   belong inside a design system package.

The picker UI (`@finografic/lucide-manager`) was originally a fuller package
that bundled its own Vite server plugin and codegen script. Those have been
stripped out in v2.x — the published package is now **UI only**. This package
(`@workspace/icons`) owns the server and the generator.

---

## File tree

```
packages/icons/
├── src/
│   ├── icons.json          ← source of truth — edit via picker, commit to git
│   ├── icons.ts            ← GENERATED — do not edit
│   ├── icons.utils.ts      ← createIconWrapper factory — handwritten, never overwritten
│   └── index.ts            ← GENERATED — named exports + re-exports
│
├── server/
│   └── icons-server.ts     ← Hono: GET + POST /api/icons-json
│                              writes icons.json, runs generate in-process on POST
│
├── scripts/
│   └── generate.ts         ← icons.json → icons.ts + index.ts
│
├── lucide-manager.config.json  ← { "serverUrl": "http://localhost:3001" }
│                                  read by the picker UI only — server ignores it
├── package.json
├── tsconfig.json
└── tsdown.config.ts
```

---

## How it works

### Source of truth: `src/icons.json`

An array of entries mapping a Lucide icon to a project-specific export alias:

```json
[
  { "lucideName": "plus",           "exportName": "Add"                  },
  { "lucideName": "triangle-alert", "exportName": "ExclamationTriangle"  },
  { "lucideName": "loader",         "exportName": "Loader"               }
]
```

`exportName` becomes the public API name — consumers import `AddIcon`,
`ExclamationTriangleIcon`, etc. The `Icon` suffix is appended by the generator.

### The generator (`scripts/generate.ts`)

Reads `src/icons.json`, sorts entries alphabetically by `exportName`, and
writes two files:

- **`src/icons.ts`** — `ICONS` map, auto-wrapped exports, `icons` object,
  `IconName` type, `ICON_NAMES` array, `IconComponent` type
- **`src/index.ts`** — named exports (`AddIcon`, `LoaderIcon`, …) plus
  re-exports of `icons`, `ICON_NAMES`, `IconName`, `IconProps`,
  `createIconWrapper`

Both carry a `!! GENERATED FILE` header. The generator **never touches**
`src/icons.utils.ts` — that file is handwritten and permanent.

The generator is invoked two ways:
- Automatically in-process by the Hono server after every POST (so the picker
  always reflects current state without a manual step)
- Manually via `pnpm icons.generate` (useful after hand-editing `icons.json`)

### The server (`server/icons-server.ts`)

Minimal Hono server on port `3001` with two routes:

```
GET  /api/icons-json  →  returns src/icons.json as JSON array
POST /api/icons-json  →  validates + writes src/icons.json,
                         runs generate in-process,
                         returns { ok: true, count: n }
```

CORS is open to `*` — required because the picker Vite dev server runs on a
different port (`:5199`).

The server does **not** read `lucide-manager.config.json`. It knows where
`icons.json` lives because it is a sibling directory — no config walking,
no env var tricks.

### The picker UI (`@finografic/lucide-manager`)

An installable npm package (v2.x) that is **UI only**:

- No server code
- No codegen script
- No `iconsJsonPlugin` — Vite runs the SPA only, not the API

It reads `lucide-manager.config.json` on startup to find `serverUrl`, then:

1. `GET /api/icons-json` — loads the current selection
2. Fetches all Lucide icon metadata from the public Lucide APIs
3. On every Add / Remove toggle → `POST /api/icons-json` with the updated array

`lucide-manager.config.json` exists solely for the picker. Its only field:

```json
{ "serverUrl": "http://localhost:3001" }
```

---

## Developer workflow

```bash
# Terminal 1 — start the Hono server
pnpm icons

# Terminal 2 — start the picker UI
# (run from packages/icons — lucide-manager reads config from cwd)
lucide-manager dev

# Re-run codegen manually if needed (e.g. after hand-editing icons.json)
pnpm icons.generate

# Build the package for workspace consumers
pnpm build
```

On each icon toggle in the picker:
1. Picker POSTs updated array to `http://localhost:3001/api/icons-json`
2. Server writes `src/icons.json`
3. Server runs `scripts/generate.ts` in-process
4. `src/icons.ts` and `src/index.ts` are updated on disk
5. Server returns `{ ok: true, count: n }` to the picker

Commit `icons.json` (source of truth) and the generated files (so consumers
work without running the server).

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

## What still needs building

The following files are provided and ready to use as-is:

| File | Status |
|---|---|
| `server/icons-server.ts` | ✅ complete |
| `scripts/generate.ts` | ✅ complete |
| `lucide-manager.config.json` | ✅ complete |
| `src/icons.utils.ts` | ✅ exists — handwritten, never touched by generate |
| `src/icons.json` | ✅ exists — seeded with current icon selection |

The following still need to be created or confirmed:

| File | Notes |
|---|---|
| `package.json` | Add `hono`, `@hono/node-server`, `tsx` as devDeps. Add `"icons"` and `"icons.generate"` scripts. See scripts section above. |
| `tsconfig.json` | Ensure `scripts/` and `server/` are included in `include` array |
| `tsdown.config.ts` | Entry point is `src/index.ts` — same pattern as `@workspace/design-system` |

After dropping in the new files, run `pnpm install` from the monorepo root,
then `pnpm icons` from `packages/icons` to verify the server starts cleanly.
Run `pnpm icons.generate` once to confirm the generator writes correctly
before opening the picker.

---

## `src/icons.utils.ts` — reference

The handwritten file that the generated `icons.ts` imports from. Never
overwritten by the generator. Exports:

- `IconProps` — `SVGProps<SVGSVGElement> & { [key: data-${string}]: string | undefined }`
- `createIconWrapper(IconComponent, exportName?)` — wraps any Lucide component
  with `.icon` class, `.icon-name--{kebab}` class, `data-icon-name` attribute,
  forwarded ref, and `displayName`

The generator calls `createIconWrapper(icon, name)` for every entry in the
`ICONS` map. The import path in the generated file is always `'./icons.utils'`.
