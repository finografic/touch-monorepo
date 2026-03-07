# lucide-manager — Start Here

## What this package is

`@workspace/lucide-manager` is a local developer tool — a Vite app with a
small server-side plugin — for browsing, selecting, and managing which Lucide
icons are exported by a host package's icon registry.

It is **not a runtime dependency**. It is installed as a `devDependency` of
the host package (e.g. `@workspace/design-system`) and launched from that
package's `package.json` scripts.

**One-line description:** Local icon picker and registry manager for lucide-react.

---

## Origin and context

This package was initially designed as a subdirectory living inside
`@workspace/design-system` at `packages/design-system/icon-tool/`. During
planning, the decision was made to extract it into a standalone peer package
at `packages/lucide-manager/` for two reasons:

1. The design-system package should concern itself only with *what* the DS is
   (tokens, recipes, components, icons). A developer tool for maintaining the
   icon registry is a *how you maintain it* concern — a different axis.
2. The tool is genuinely reusable. Any package in the workspace that maintains
   a lucide-react icon registry can install and use it.

The initial implementation files are in `.claude/assets/initial-files/` and
were generated in the context of the tool living inside the DS. Path resolution
logic in those files (`plugin.ts`, `generate-icons-ts.ts`) assumed a fixed
sibling relationship between the tool directory and the DS `src/icons/` folder.
That assumption must be replaced with the config-loader approach described
below before the files are used.

---

## How it works — the full picture

### Source of truth: `icons.json`

The host package (e.g. `design-system`) maintains a file:

```
packages/design-system/src/icons/icons.json
```

This is the source of truth for which Lucide icons are included in the
registry. Shape:

```json
[
  { "lucideName": "arrow-up",     "exportName": "ArrowUp" },
  { "lucideName": "chevron-down", "exportName": "ChevronDown" }
]
```

- `lucideName` — kebab-case name as Lucide calls it (e.g. `"arrow-up"`)
- `exportName` — PascalCase without the `Icon` suffix (e.g. `"ArrowUp"`).
  Normally auto-derived from `lucideName`, but overridable in rare cases.

### Generated files: `icons.ts` and `index.ts`

`icons.json` is the only file a developer ever edits (via the picker UI or
directly). From it, two files are generated:

- `src/icons/icons.ts` — the icon registry (`ICONS` object, wrapped exports)
- `src/icons/index.ts` — named exports (`ArrowUpIcon`, `ChevronDownIcon`, etc.)

These are generated artifacts. They should be treated like `styled-system/`
output from Panda codegen — committed for readability, but never hand-edited.

See `.claude/assets/icons/` for the current state of the target files in the
design-system, including `icons.utils.ts` which is **not generated** and must
not be overwritten. The generate script only touches `icons.ts` and `index.ts`.

### The data flow

```
icons.json  →  generate script  →  icons.ts + index.ts  →  pnpm build  →  dist/
    ↑
lucide-manager (picker UI) writes here via Vite plugin server endpoint
```

### Lucide data source

The picker fetches icon metadata from two public Lucide APIs on startup:

- `https://lucide.dev/api/icon-nodes` — SVG node tree for every icon
- `https://lucide.dev/api/categories` — category membership per icon

Both are served with `Cache-Control: public, max-age=86400`. No local snapshot
is maintained. Requires internet access on first load per day.

Icons are rendered directly from their node trees — no dynamic React component
imports. This keeps the picker fast with 1500+ icons.

---

## Config-loader pattern (critical — replaces initial-files approach)

The initial files used `import.meta.url`-relative path resolution, which only
worked when the tool lived as a subdirectory of the DS. As a standalone
installable package, the tool has no knowledge of where the host package's
`icons.json` lives.

The solution is a config file that the host package places in its own root:

```jsonc
// packages/design-system/lucide-manager.config.json
{
  "iconsJsonPath": "./src/icons/icons.json",
  "iconsDir":      "./src/icons"
}
```

At startup, the tool walks up from `process.cwd()` looking for
`lucide-manager.config.json`. This means the tool must always be launched from
the host package root (which is exactly what `pnpm --filter` does).

Both `plugin.ts` (Vite server plugin) and `generate-icons-ts.ts` (generate
script) must use this config-loader for all path resolution. Neither file
should contain any hardcoded paths.

The config-loader itself is a small shared utility inside this package:

```
src/
  config/
    loadConfig.ts    ← walks cwd upward, reads lucide-manager.config.json
```

---

## Package structure

```
packages/lucide-manager/
  icons.json                    ← default/fallback (not used in normal flow)
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  scripts/
    generate-icons-ts.ts        ← reads icons.json → writes icons.ts + index.ts
  src/
    main.tsx
    App.tsx
    config/
      loadConfig.ts             ← NEW: replaces hardcoded path resolution
    components/
      CategorySidebar.tsx
      IconCard.tsx
      IconDetail.tsx
      IconSvg.tsx
    hooks/
      useLucideData.ts
      useIconsJson.ts
    server/
      plugin.ts                 ← Vite plugin: GET/POST /api/icons-json
```

---

## Host package integration (design-system example)

### 1. Install

```jsonc
// packages/design-system/package.json
{
  "devDependencies": {
    "@workspace/lucide-manager": "workspace:*"
  },
  "scripts": {
    "icons":          "lucide-manager dev",
    "generate:icons": "lucide-manager generate"
  }
}
```

`lucide-manager dev` and `lucide-manager generate` are `bin` entries defined
in this package's `package.json`. They must be added:

```jsonc
// packages/lucide-manager/package.json
{
  "bin": {
    "lucide-manager": "./bin/lucide-manager.js"
  }
}
```

The bin entry is a small CLI shim that reads the first argument (`dev` or
`generate`) and either starts Vite or runs the generate script.

### 2. Config file

Place in the host package root (alongside its `package.json`):

```jsonc
// packages/design-system/lucide-manager.config.json
{
  "iconsJsonPath": "./src/icons/icons.json",
  "iconsDir":      "./src/icons"
}
```

### 3. Seed `icons.json`

The initial `icons.json` for the design-system is in
`.claude/assets/initial-files/icons.json`. Copy it to
`packages/design-system/src/icons/icons.json`.

### 4. Workspace registration

```yaml
# pnpm-workspace.yaml
packages:
  - packages/*
  - apps/*
```

If the monorepo already uses `packages/*`, no change needed. If not, add
`packages/lucide-manager` explicitly.

---

## Developer workflow (day-to-day)

```bash
# From packages/design-system:
pnpm icons              # launches picker at localhost:5199

# After making selections in the picker:
pnpm generate:icons     # writes icons.ts + index.ts from icons.json
pnpm build              # rebuilds DS dist
```

Selections are saved automatically as you click in the picker (debounced POST
to `/api/icons-json`). The generate step is always explicit and manual.

---

## What to build / task list

The following delta work is needed before this package is functional. The
initial-files in `.claude/assets/initial-files/` are a solid starting point
but require the changes marked below.

### 1. `src/config/loadConfig.ts` — NEW FILE

Write a config-loader that:
- Accepts an optional `startDir` (defaults to `process.cwd()`)
- Walks up the directory tree looking for `lucide-manager.config.json`
- Throws a descriptive error if not found (with hint to create the config file)
- Returns `{ iconsJsonPath: string, iconsDir: string }` with paths resolved
  to absolute paths

### 2. `src/server/plugin.ts` — MODIFY from initial-files

Replace the hardcoded `import.meta.url`-relative `jsonPath` with a call to
`loadConfig()`. The resolved `iconsJsonPath` is what the plugin reads and
writes.

### 3. `scripts/generate-icons-ts.ts` — MODIFY from initial-files

Replace the hardcoded `toolRoot` / `dsRoot` / `iconsDir` path block with a
call to `loadConfig()`. Use `config.iconsDir` for the output directory and
`config.iconsJsonPath` for the input file.

Also verify: the generate script must **not** overwrite `icons.utils.ts`.
It only writes `icons.ts` and `index.ts`.

### 4. `bin/lucide-manager.js` — NEW FILE

Small CLI shim. Reads `process.argv[2]` for the command:
- `dev` → starts Vite programmatically (or via `execa`/`child_process`)
- `generate` → runs `generate-icons-ts.ts` via `tsx`

### 5. `package.json` — UPDATE from initial-files

- Rename `@workspace/icon-tool` → `@workspace/lucide-manager`
- Add `"bin": { "lucide-manager": "./bin/lucide-manager.js" }`
- Remove `private: true` only if you ever intend to publish; keep it for now

### 6. Remaining files — COPY AS-IS from initial-files

These require no changes beyond the package rename in any internal references:
- `src/App.tsx`
- `src/main.tsx`
- `src/components/CategorySidebar.tsx`
- `src/components/IconCard.tsx`
- `src/components/IconDetail.tsx`
- `src/components/IconSvg.tsx`
- `src/hooks/useLucideData.ts`
- `src/hooks/useIconsJson.ts`
- `index.html`
- `tsconfig.json`
- `vite.config.ts`

---

## Reference: target icons files in design-system

`.claude/assets/icons/` contains the current state of
`packages/design-system/src/icons/`:

- `icons.ts` — the registry the generate script will overwrite
- `index.ts` — the named exports the generate script will overwrite
- `icons.utils.ts` — **never touched by the generate script**

The generate script output must match the structure and style of the existing
`icons.ts` and `index.ts` exactly, including the file header comment that
marks them as generated artifacts.

### `icons.utils.ts` — handwritten, read-only reference

`.claude/assets/icons/icons.utils.ts` is the one file in this folder that is
handwritten and lives permanently in the design-system. It is included here
purely as a reference — the generate script must never write to or overwrite it.

It exports two things the generated `icons.ts` depends on:

- `IconProps` — the SVG prop type used by all icon components
- `createIconWrapper(IconComponent, exportName)` — wraps a raw Lucide component
  with a stable `.icon` class, `data-icon-name` attribute, `displayName`, and
  forwarded ref

When implementing `generate-icons-ts.ts`, read `icons.utils.ts` to confirm:
- The exact import path (`'./icons.utils'`)
- The exact call signature of `createIconWrapper` so the generated registry
  code matches what the host package actually exports
