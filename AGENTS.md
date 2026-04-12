# AGENTS.md — AI Assistant Guide

## Rules — Project-Specific

- Project-specific rules live in `.github/instructions/project/**/*.instructions.md`.
- Do not reference `@workspace/*` — all imports and deps must use published package names.
- Design System Usage: `.github/instructions/project/design-system-usage.instructions.md`

## Rules — Global

Rules are canonical in `.github/instructions/` and shared across Claude Code, Cursor, and GitHub Copilot.

- General: `.github/instructions/00-general.instructions.md`
- File Naming: `.github/instructions/01-file-naming.instructions.md`
- TypeScript: `.github/instructions/02-typescript-patterns.instructions.md`
- ESLint & Style: `.github/instructions/04-eslint-code-style.instructions.md`
- Documentation: `.github/instructions/05-documentation.instructions.md`
- Modern TS Patterns: `.github/instructions/06-modern-typescript-patterns.instructions.md`
- Variable Naming: `.github/instructions/07-variable-naming.instructions.md`
- README Standards: `.github/instructions/08-readme-standards.instructions.md`
- Picocolors CLI styling: `.github/instructions/09-picocolors-cli-styling.instructions.md`
- Git Policy: `.github/instructions/10-git-policy.instructions.md`
- Agent-facing Markdown: `.github/instructions/11-agent-facing-markdown.instructions.md`
- Feature Design Specs: `.github/instructions/12-feature-design-specs.instructions.md`

---

## Rules — Markdown Tables

- Padded pipes: one space on each side of every `|`, including the separator row.
- Align column widths so all cells in the same column are equal width.

---

## Git Policy

- IMPORTANT: NEVER include `Co-Authored-By` lines in commit messages. Non-negotiable.
- `.github/instructions/10-git-policy.instructions.md` (see Commits and Releases sections)

--

## Learned User Preferences

- **Variable naming:** Follow `.github/instructions/07-variable-naming.instructions.md` (full words, no cryptic abbreviations; descriptive result names). Prefer names that explain domain meaning (e.g. translation key paths), not opaque `rest`/`ra`/`rb` unless paired with a clear comment.
- **Translation “domains” subtree:** Prefer **`domain`** singular for the i18n/product concept and **`domainMembers`** (plural) for variables that hold the relative path / sort slice under `domains.*` (never `domainsRest` / vague `rest`). Use singular `domainMember` only when a name must refer to one member explicitly.
- **Formatting:** Put an empty line before every `return` in a multi-statement block so returns stay visually separated from the logic above.
- Document Panda token keys and how recipes reference them in token source files (e.g. `spacing.tokens.ts`), not in individual recipe files, unless the recipe needs a one-off note.
- Prefer fetching supported languages from the API or shared runtime state over hardcoded `DEFAULT_SUPPORTED_LANGUAGES`-style lists when new locales must work without redeploying generated config.
- Admin route IDs used for i18n keys should match the key namespace in translation assets (e.g. `items` vs `products`) so navbar and pages resolve the same keys.
- Root follow-up and maintenance trackers use `TODO_{CATEGORY}.{PRIORITY}.md` at the repo root (e.g. `TODO_AUTH.P1.md`, `TODO_MAINTENANCE.P3.md`).

## Learned Workspace Facts

- Root deployment script runs `packages/build-deployment/src/build-deployment.ts`; `scripts/src/build-deployment-dev/` is not the active entry.
- `@workspace/design-system` package.json `exports` must list every CSS (or asset) subpath the client imports (e.g. `./forms/forms.css`) or Vite production builds fail on missing specifiers.
- In `packages/design-system` ESLint, include `globals.browser` with `globals.node` so `no-undef` accepts DOM types (`SVGSVGElement`, `HTMLDivElement`) in components consumed by the browser.
- Lucide-based icon wrappers: `IconProps` should extend `React.SVGProps<SVGSVGElement>` (not `unknown`) so `ComponentType<IconProps>` accepts Lucide `ForwardRefExoticComponent` types.
- Client Vite: define more specific `resolve.alias` entries (e.g. `@workspace/foo/bar`) before the shorter `@workspace/foo` alias so subpaths do not resolve to `index.ts` + suffix paths.
- Server production bundle: add each used `@workspace/*` package to tsup `noExternal` so deployment has no unresolved workspace imports; client uses aliases plus `optimizeDeps.include` as documented in `packages/WORKSPACE-RESOLUTION.md`.
- Auth.js (JWT): the API may use an ephemeral JWT signing secret in development so sessions do not survive API restarts (`apps/server/src/lib/auth-secret.runtime.ts`, optional `AUTH_INVALIDATE_JWT_ON_SERVER_BOOT` to opt out in dev or force ephemeral in prod).
- Slot grid layout on main vs admin: shared iteration uses `mapGridByColumns` in `apps/client/src/utils/grid.utils.ts`; column count should use the same `calculateColumns` helper as admin when deriving dimensions from active slot count.
- Pad slot selection (`selectedSlots`, `toggleSlot`, `setSelectedSlots`) lives in **`MetadataProvider`** / **`MetadataContext`** (root-mounted in `App.tsx`); **`useLayoutUi`** merges that slice (`toggleMainPageSlot` aliases `toggleSlot`) so selection survives `/admin` when **`LayoutUiProvider`** unmounts. Prefer **`useLayoutUi()`** for slot APIs in main UI, or **`useMetadata()`** for direct access.
- **`ADMIN_PAGE_SEGMENTS_NAV_ORDER`** (translations “Páginas” section order) is derived from **`ADMIN_ROUTE_CONFIGS`** in **`admin/config/admin.routes.selectors.ts`** rather than `admin.routes.map.ts`, to avoid circular imports with the translations route tree.
- **`PadCheckbox`** merges optional `css` from `PadSlot` with `padStyles` (`[padStyles, slotCss]`) so slot-level Emotion rules apply on idle relay pads; **`PadSlotToggle`** accepts `css` for the timer wrapper.
- TanStack Query **`useMutation`**: in `useEffect` deps, use the stable **`mutate`** function, not the full mutation result object — the object’s identity changes when `isPending` / error state updates and can retrigger the effect in a loop.
