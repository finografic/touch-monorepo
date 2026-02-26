# touch-monorepo — Handoff

## Project

`touch-monorepo` — ServiFresc. Design-system: `@workspace/design-system` v0.0.1.
Phase: design-system complete, client migration in progress (Phase 6a/6b done).

## Architecture

Monorepo with `apps/client` (Vite + React), `apps/server` (Hono), and packages:
`design-system`, `core`, `shared`, `i18n`, `config`. The design-system is a
Panda CSS + Ark UI component library built as a private workspace package.
The client consumes it via workspace link. Styling stack is Emotion (existing)
+ Panda CSS (new, co-existing). Radix Themes is still active but being phased out.

## Stack

- **Design-system:** Panda CSS 0.53, Ark UI 5.x, Lucide React, tsdown (build)
- **Client:** Vite 7, React 18, Emotion, Radix Themes 3.3, PrimeReact, React Router 7
- **Tooling:** pnpm workspaces, TypeScript 5.9, ESLint, dprint

## Schema / Types

- `IconProps` — `React.SVGProps<SVGSVGElement>` + `data-*` index (icons)
- `CollectionItem`, `ListCollection` — re-exported from Ark for Select usage
- Recipe return types — all slot recipes expose typed class-name objects

## CLI Commands

No CLI. `panda codegen && panda cssgen` runs before every client dev/build.

## Decisions

1. Use tsdown (not tsup) for design-system build; outputs `.mjs`/`.d.mts` (2026-02-26)
2. Emotion co-existence — 117 `.styles.ts` files NOT rewritten; Panda added alongside (2026-02-26)
3. Dark mode via `[data-theme="dark"]` condition in Panda, matches existing EmotionThemeProvider (2026-02-26)
4. `panda cssgen` (no PostCSS) — compatible with client's lightningcss Vite transformer (2026-02-26)
5. Shadow base tokens nested under `shadows.base.*` to avoid circular self-refs in semantic tokens (2026-02-26)
6. `preflight: false` in client panda.config — reset already provided by design-system reset.css (2026-02-26)

## Open Questions

1. **Spinner** — No design-system spinner. Options: add recipe, keep Radix Spinner, or inline CSS. Blocking 6d.
2. **Card** — 5 uses in client, no recipe. Probably inline Panda styles or local wrapper.
3. **Radix layout primitives** (Flex 28×, Box 22×) — Phase 6c: replace with plain divs + Panda utilities. Consider a thin local Stack/Row wrapper to reduce noise.
4. **PrimeReact** — Keep indefinitely (tables, sliders). No design-system equivalents planned.

## Status

Design-system is feature-complete for Phase 3+: all tokens, recipes (button, badge,
callout, checkbox, dialog, form-field, input, label, menu, popover, select, switch,
tabs, text, toast, tooltip), components, icon system, global styles, and build tooling.
Client migration: Panda CSS wired (6a), dark mode configured (6b). Next session:
Phase 6c — replace Radix Themes layout primitives (Flex, Box, Grid, Container).
After that: Phase 6d — swap Radix component imports for design-system equivalents.
