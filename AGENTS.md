# Agent memory (continual learning)

## Learned User Preferences

- **Variable naming:** Follow `.github/instructions/07-variable-naming.instructions.md` (full words, no cryptic abbreviations; descriptive result names). Prefer names that explain domain meaning (e.g. translation key paths), not opaque `rest`/`ra`/`rb` unless paired with a clear comment.
- **Translation “domains” subtree:** Prefer **`domain`** singular for the i18n/product concept and **`domainMembers`** (plural) for variables that hold the relative path / sort slice under `domains.*` (never `domainsRest` / vague `rest`). Use singular `domainMember` only when a name must refer to one member explicitly.
- **Formatting:** Put an empty line before every `return` in a multi-statement block so returns stay visually separated from the logic above.
- Document Panda token keys and how recipes reference them in token source files (e.g. `spacing.tokens.ts`), not in individual recipe files, unless the recipe needs a one-off note.
- Prefer fetching supported languages from the API or shared runtime state over hardcoded `DEFAULT_SUPPORTED_LANGUAGES`-style lists when new locales must work without redeploying generated config.
- Admin route IDs used for i18n keys should match the key namespace in translation assets (e.g. `items` vs `products`) so navbar and pages resolve the same keys.

## Learned Workspace Facts

- Root deployment script runs `packages/build-deployment/src/build-deployment.ts`; `scripts/src/build-deployment-dev/` is not the active entry.
- `@workspace/design-system` package.json `exports` must list every CSS (or asset) subpath the client imports (e.g. `./forms/forms.css`) or Vite production builds fail on missing specifiers.
- In `packages/design-system` ESLint, include `globals.browser` with `globals.node` so `no-undef` accepts DOM types (`SVGSVGElement`, `HTMLDivElement`) in components consumed by the browser.
- Lucide-based icon wrappers: `IconProps` should extend `React.SVGProps<SVGSVGElement>` (not `unknown`) so `ComponentType<IconProps>` accepts Lucide `ForwardRefExoticComponent` types.
- Client Vite: define more specific `resolve.alias` entries (e.g. `@workspace/foo/bar`) before the shorter `@workspace/foo` alias so subpaths do not resolve to `index.ts` + suffix paths.
- Server production bundle: add each used `@workspace/*` package to tsup `noExternal` so deployment has no unresolved workspace imports; client uses aliases plus `optimizeDeps.include` as documented in `packages/WORKSPACE-RESOLUTION.md`.
- Panda `satisfies SystemStyleObject` does not reliably reject invalid spacing token strings; token validation remains largely build/runtime, not strict TypeScript.
- Slot grid layout on main vs admin: shared iteration uses `mapGridByColumns` in `apps/client/src/utils/grid.utils.ts`; column count should use the same `calculateColumns` helper as admin when deriving dimensions from active slot count.
- Pad slot selection (`selectedSlots`, `toggleSlot`, `setSelectedSlots`) lives in **`MetadataProvider`** / **`MetadataContext`** (root-mounted in `App.tsx`); **`useLayoutUi`** merges that slice (`toggleMainPageSlot` aliases `toggleSlot`) so selection survives `/admin` when **`LayoutUiProvider`** unmounts. Prefer **`useLayoutUi()`** for slot APIs in main UI, or **`useMetadata()`** for direct access.
- **`ADMIN_PAGE_SEGMENTS_NAV_ORDER`** (translations “Páginas” section order) is derived from **`ADMIN_ROUTE_CONFIGS`** in **`admin/config/admin.routes.selectors.ts`** rather than `admin.routes.map.ts`, to avoid circular imports with the translations route tree.
- **`PadCheckbox`** merges optional `css` from `PadSlot` with `padStyles` (`[padStyles, slotCss]`) so slot-level Emotion rules apply on idle relay pads; **`PadSlotToggle`** accepts `css` for the timer wrapper.
