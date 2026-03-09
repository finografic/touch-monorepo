# Design System Migration — Final Steps

## Phase 6g — CSS Custom Property Audit

**When:** After 6f (or can do now — Radix is already gone).

**Code-side audit complete.** Findings:

- ~~`_migration.tokens.ts` deleted~~ ✅ Already gone
- Radix Themes removed — main source of per-element noise is gone ✅
- Panda utility classes are all class-scoped (`.w_20`, etc.) — no noise there ✅
- **Remaining noise:** Panda's `@layer base` still emits a `*, ::before, ::after, ::backdrop`
  block initializing ~20 composable utility vars (`--blur`, `--translate-x`, `--rotate`, etc.)
  — **but none of these Panda composable transform/filter utilities are actually used**
  (all transforms in the app are hardcoded `transform: scale(...)` in keyframes/recipes)

**Options for the `*` utility reset noise:**

| Option | What it does | Effort |
|---|---|---|
| **Accept it** | Leave as-is — it's one declaration block, not per-rule | None |
| **Disable unused utility groups** | Remove filter/backdrop/transform from Panda config | Low |
| **`utilities: { reset: 'container' }` _(not valid option)_| Scope to container class | — |

Simplest fix: disable the filter/transform composable utilities in `panda.config.ts` since they aren't used.

**DevTools check still needed:**

1. Open DevTools on a production build, select any element
2. Confirm the only `--` vars inherited are Panda tokens (colors, spacing) not Radix noise
3. If the `--blur` / `--translate-x` init block is still visible as noise, apply the fix above

---

## FieldWrapper → FieldBox ✅ Done

All consumers of `apps/client/src/forms/FieldWrapper/` migrated to `FieldBox` from
`@workspace/design-system/forms`. `FieldWrapper/` directory deleted.

Files updated: `SoundConfigurationSection.tsx`, `OrdersForm.tsx`, `PublicModePage.tsx`.

---

## PrimeReact — Incremental Replacement

The following use PrimeReact components with no DS equivalent yet. Not blocked.

| File | Component | Complexity |
|---|---|---|
| `SelectAlt.tsx` | `Dropdown` (editable mode) | Medium |
| `SelectWithNew.tsx` | `Dropdown` (editable + "add new") | High |
| `TemperatureInputField.tsx` | `InputNumber` (locale, spinners, °C) | Medium |
| `ListBoxSelect.tsx` | `ListBox` (visible list) | Low |
| `OrdersTable.tsx` | `DataTable` (sortable/filterable table) | High |

### OrdersTable → TanStack Table

The DataTable replacement requires **building the component first**, then swapping it in:

1. Build a reusable `DataTable` component using `@tanstack/react-table`
   - Sorting, column filtering, row selection (checkbox)
   - Style with DS token CSS vars (see docs: `table-tanstack-01.md`, `table-tanstack-02.md`)
2. Replace `OrdersTable.tsx` (PrimeReact `DataTable`) with the new component
3. Remove PrimeReact theme CSS imports and the PrimeReact wrapper
4. Once all PrimeReact usages are gone: remove `primeReact` dependency from `package.json`

---

## Recommended Order of Work

1. ~~Phase 6e — clear ~14 remaining imports~~          ✅ Done
2. ~~AdminNavigation TabNav migration~~                ✅ Done
3. ~~Phase 6f (partial) — prune styles/, remove Radix Themes, EmotionThemeProvider~~ ✅ Done
4. ~~Phase 6f (remaining) — remove @emotion packages + .styles.ts files~~
5. Phase 6g — DevTools audit (can do now — Radix is already gone)
6. PrimeReact replacement (incremental, separate concern)

---
