# Design System Migration — Final Steps

> **Where we are:** Phases 6a–6d complete. The design-system package is fully built.
> All Radix component imports are replaced. 14 unused `@radix-ui` packages removed.
> Phase 6e is ~85% done — ~14 external `styles/` imports remain.
> The path forward is now clear (see Phase 6f below).

---

## What's Left At a Glance

| Work | Scope | Blocker |
|---|---|---|
| **6e** — Clear remaining `styles/` imports | ~14 imports in ~6 files | None |
| **6f** — Flatten + prune `styles/`; remove Radix Themes + Emotion | See checklist below | 6e must be zero |
| **6g** — CSS custom property audit | DevTools investigation | 6f |
| **AdminNavigation** — `TabNav` from `@radix-ui/themes` | 1 component rebuild | Must land before 6f |
| **PrimeReact** | DataTable, Dropdown, InputNumber, ListBox | Separate concern, no blocker |

---

## Phase 6e — Migrate `styles/` Imports

### Current state

~14 `from 'styles/...'` imports remain from non-`styles/` files (was 107 — 93 migrated).

**Breakdown by path:**

| Done | Path | Count | Action |
|---|---|---|---|
| ✅ | `styles/icons` | 44 | Added named exports to DS icons; bulk-replaced import path |
| ✅ | `styles/colors/palette.types` | 8 | Replaced `ColorPalette` with DS `ColorsKey` |
| ✅ | `styles/colors/colors-direct` | 4 | Replaced with `colors` from DS tokens |
| ✅ | `styles/viewport/viewport.types` | 4 | Replaced with DS `ScreenClass` / `BreakpointMap`; `xxl` → `'2xl'` in Header.tsx |
| ✅ | `styles/layout/base.constants` | 3 | Replaced with DS `spacing` via `const padding = spacing` alias |
| ✅ | `styles/project/buttons.styles` | 6 | Moved `stylesButtonBase`/`stylesSmallButton` → `components/Button/button-base.styles.ts` |
| ✅ | `styles/forms/forms.constants` | 6 | Moved → `forms/forms.config.ts`; fixed `colors-direct` → DS tokens |
| ✅ | `styles/forms/forms.styles` | 5 | External consumers redirected; `cssForms` stays via relative import until 6f |
| ☐ | `styles/themes/emotion-theme.types` | 3 | Replace with inline `EmotionTheme` type or remove with Emotion in 6f |
| ☐ | `styles/project/*.styles` (appContent, 800x480, 1024x600) | 6 | Convert consumers to relative imports — these files **survive** into the pruned `styles/` |
| ☐ | `styles/fonts/fonts.styles` | 1 | Convert consumer to relative import — file **survives** |
| ☐ | `styles/global.styles` + `styles/radix-ui/theme.config` + `generate-oklch-themes` | 4 | Tied to Radix/Emotion removal — handle in 6f |

### Done when

```bash
grep -r "from 'styles/" apps/client/src/ --include="*.ts" --include="*.tsx"
# → 0 results (from non-styles/ files only)
```

---

## Phase 6f — Flatten + Prune `styles/` · Remove Radix Themes + Emotion

**Requires:** Phase 6e complete + AdminNavigation migrated.

> **Decision:** `styles/` is NOT deleted entirely. The DS is (and will become an
> installable npm package) — things that are universally applicable live there.
> `styles/` survives as a small, flat folder of **project-specific** app-level
> styles that will never belong in the DS.

### What survives in `styles/` (flat, ~5 files)

| File | Why it stays |
|---|---|
| `styles/project.styles.ts` | Admin + front-end layout rules; app-specific |
| `styles/project.800x480.styles.ts` | Pi 800×480 hardware overrides; deeply project-specific |
| `styles/project.1024x600.styles.ts` | Pi 1024×600 hardware overrides; deeply project-specific |
| `styles/global.styles.ts` | App-level resets, scrollbar rules, Radix cleanup |
| `styles/fonts.styles.ts` | Font face declarations; project font choices |

Everything else in `styles/` is deleted.

### Checklist

**1. Migrate `EmotionTheme` type (3 files)**

`styles/themes/emotion-theme.types` is only used as the Emotion theme shape.
Two options — choose one before proceeding:
- **a) Inline it** — move the type definition into each consumer directly
- **b) Delete it** — remove `EmotionThemeProvider` and the typed theme pattern entirely,
  replacing with CSS vars (already the direction Panda + DS is heading)

Option (b) is cleaner but requires updating `Layout.tsx`, `Layout.styles.ts`, and
`EmotionThemeProvider.tsx` to drop the typed theme — do this as part of Emotion removal below.

**2. Flatten `styles/project/` → root of `styles/`**

Move and rename:
```
styles/project/project.styles.ts        → styles/project.styles.ts
styles/project/project.app.800x480.styles.ts → styles/project.800x480.styles.ts
styles/project/project.app.1024x600.styles.ts → styles/project.1024x600.styles.ts
```
Update the 2 consumer files (`AdminLayout.styles.ts`, `Layout.styles.ts`) to use
the new paths. Delete the `styles/project/` subdirectory.

**3. Flatten `styles/fonts/` → root of `styles/`**

```
styles/fonts/fonts.styles.ts → styles/fonts.styles.ts
```
Update `TimesRepeaterTable.styles.ts` consumer. Delete `styles/fonts/` subdirectory.

**4. Flatten `styles/forms/` → root of `styles/`**

`cssForms` (consumed by `AdminLayout.styles.ts`) is the only remaining reason
`styles/forms/` exists. Consolidate the whole `forms/` subtree into a single:
```
styles/forms.styles.ts   ← merge formsBase + formsInputs + formsSelect etc.
```
Or better: convert to a static CSS file `styles/forms.css` that is imported
directly in `main.tsx` alongside `forms.css` from the DS. At that point,
`cssForms` is no longer an Emotion interpolation.

**5. Remove Radix Themes**

- `App.tsx`: remove `Theme as RadixTheme` import + `<RadixTheme>` wrapper
- `main.tsx`: remove `import '@radix-ui/themes/styles.css'`
- Remove `styles/radix-ui/` directory entirely (overrides no longer needed)
- `apps/client/package.json`: remove `"@radix-ui/themes"`, `"radix-themes-tw"`
- Audit `theme.css` — remove rules that compensated for Radix globals

**6. Remove Emotion**

- `App.tsx` / `providers/`: remove `EmotionThemeProvider`
- `apps/client/package.json`: remove `@emotion/react`, `@emotion/styled`, `@emotion/css`
- Delete remaining `.styles.ts` Emotion files OR convert to `css()` from `@pandacss/dev`
- Delete `styles/themes/` directory (OKLCH generation, hex themes — replaced by CSS vars)
- Remove `_migration.tokens.ts` compat shim from the DS package

**7. Confirm dark mode**

`panda.config.ts` uses `conditions.dark = '[data-theme="dark"] &'`. Confirm
`[data-theme="dark"]` is still set on `<html>` by whatever replaces
`EmotionThemeProvider` (direct `document.documentElement.setAttribute` or Zustand).

**8. Verify**

```bash
pnpm typecheck    # target: 0 errors
pnpm build        # must pass clean
```

**End state:** `styles/` contains exactly the ~5 files listed above, flat, no subdirectories.

---

## Phase 6g — CSS Custom Property Audit

**When:** After 6f.

DevTools currently shows hundreds of `--blur`, `--brightness`, `--translate-x` etc.
custom property declarations stacking per-element. After 6f, Radix Themes and Emotion
are gone — re-audit to see how much noise remains.

1. Open DevTools and count overrides per element
2. If Panda noise is still high, consider `utilities: { reset: 'container' }` in
   `panda.config.ts` to scope resets to a container class instead of `*`
3. Audit `_migration.tokens.ts` — confirm it is deleted (step 6f.6 above)
4. Check for duplicate token names between Panda tokens and any remaining CSS vars

---

## AdminNavigation — `TabNav` Hold

**Must land before Phase 6f** (removing `@radix-ui/themes` breaks the build).

`apps/client/src/admin/components/AdminNavigation/AdminNavbar.tsx` uses `TabNav`
from `@radix-ui/themes`. Replace with plain buttons + active-state className:

```tsx
// Before
<TabNav.Root size="2" className="admin-nav" style={{ justifyContent: 'center' }}>
  <TabNav.Link asChild active={isActive}>
    <button ...>{navItem.label}</button>
  </TabNav.Link>
</TabNav.Root>

// After
<div className="admin-nav" role="tablist" style={{ justifyContent: 'center' }}>
  <button
    role="tab"
    aria-selected={isActive}
    className={`nav-button ${isActive ? 'active' : ''}`}
    ...
  >
    {navItem.label}
  </button>
</div>
```

Style the active tab directly in the component's `.styles.ts` (or Panda recipe).

---

## PrimeReact — Not Part of This Migration

The following use PrimeReact components with no DS equivalent. Not blocked.

| File | Component | Complexity |
|---|---|---|
| `SelectAlt.tsx` | `Dropdown` (editable mode) | Medium |
| `SelectWithNew.tsx` | `Dropdown` (editable + "add new") | High |
| `TemperatureInputField.tsx` | `InputNumber` (locale, spinners, °C) | Medium |
| `ListBoxSelect.tsx` | `ListBox` (visible list) | Low |
| `OrdersTable.tsx` | `DataTable` (sortable/filterable table) | High |

---

## Recommended Order of Work

```
1. Phase 6e — clear ~14 remaining imports          ~30 min
2. AdminNavigation TabNav migration                 ~1 hour
3. Phase 6f — flatten styles/ + remove Radix/Emotion  ~2–3 hours
4. Phase 6g — DevTools audit                        ~30 min
```

Total remaining effort: **~4–5 hours** across sessions.
