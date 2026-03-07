# touch-monorepo — Handoff

## Project

`touch-monorepo` — ServiFresc. Design-system: `@workspace/design-system` v0.0.1.
Phase: design-system complete, client migration in progress (Phase 6a/6b done).

## Architecture

Monorepo with `apps/client` (Vite + React), `apps/server` (Hono), and packages:
`design-system`, `core`, `shared`, `i18n`, `config`. The design-system is a
Panda CSS + Ark UI component library built as a private workspace package.
The client consumes it via workspace link. Styling stack is Emotion (existing,
being removed) + Panda CSS (new). Radix Themes has been fully removed.

## Stack

- **Design-system:** Panda CSS 0.53, Ark UI 5.x, Lucide React, tsdown (build)
- **Client:** Vite 7, React 18, Emotion (being removed), PrimeReact, React Router 7
- **Tooling:** pnpm workspaces, TypeScript 5.9, ESLint, dprint

## Schema / Types

- `IconProps` — `React.SVGProps<SVGSVGElement>` + `data-*` index (icons)
- `CollectionItem`, `ListCollection` — re-exported from Ark for Select usage
- Recipe return types — all slot recipes expose typed class-name objects

## CLI Commands

No CLI. `panda codegen && panda cssgen` runs before every client dev/build.

## Decisions

1. Use tsdown (not tsup) for design-system build; outputs `.mjs`/`.d.mts` (2026-02-26)
2. Emotion co-existence — `.styles.ts` files not rewritten yet; Panda added alongside (2026-02-26)
3. Dark mode via `[data-theme="dark"]` in Panda, matches EmotionThemeProvider (2026-02-26)
4. `panda cssgen` (no PostCSS) — compatible with lightningcss Vite transformer (2026-02-26)
5. Shadow base tokens nested under `shadows.base.*` to avoid circular self-refs (2026-02-26)
6. `preflight: false` in client panda.config — reset from design-system reset.css (2026-02-26)
7. `styles/` survives Phase 6f as ~5 flat project-specific files, not deleted entirely (2026-03-06)
8. Radix Themes fully removed — replaced all `--gray-*`/`--radius-N` vars with Panda tokens (2026-03-06)

## Open Questions

1. **Emotion removal** — ~100 `.styles.ts` files still use Emotion. Remove after DS migration stable.
2. **PrimeReact** — Keep indefinitely (DataTable, Dropdown, InputNumber, ListBox). No DS equivalents.

## Status

Phase 6f complete. Radix Themes package removed, all Radix CSS vars replaced with Panda
design-system tokens across 14+ files. styles/ flattened and pruned. forms.config.ts
transparency token names fixed. All form inputs already use DS InputField (Ark UI).
Next: Phase 6g CSS custom property audit (DevTools), then Emotion removal.
Pre-existing TS errors remain (~91) from unrelated modules (relays, translations, auth).
