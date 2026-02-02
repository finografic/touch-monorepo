# TODO: Icon System Migration

## Current State

Icons are imported from `lucide-react`, wrapped with `createIconWrapper()` for auto-className, and exported with custom names (e.g., `AddIcon`, `CloseIcon`).

```typescript
// Current usage
import { AddIcon, CloseIcon, MenuIcon } from 'styles/icons';
<AddIcon />
<CloseIcon />
```

---

## Phase 1: Migrate to `Icon.X` Namespace Pattern

**Goal:** Single import, dot-notation access, cleaner usage.

### New Usage Pattern

```typescript
// New usage
import { Icon } from 'styles/icons';
<Icon.Add />
<Icon.Close />
<Icon.Menu />
```

### Implementation

1. Create the `Icon` object from `wrappedIcons`:

   ```typescript
   export const Icon = wrappedIcons;
   ```

2. Update all imports across the codebase:

   ```typescript
   // Before
   import { AddIcon, CloseIcon } from 'styles/icons';
   <AddIcon /> <CloseIcon />

   // After
   import { Icon } from 'styles/icons';
   <Icon.Add /> <Icon.Close />
   ```

3. Remove the "Icon" suffix from all keys in the `ICONS` mapping:

   ```typescript
   // Before
   const ICONS = {
     AddIcon: Lucide.Plus,
     CloseIcon: Lucide.X,
   };

   // After
   const ICONS = {
     Add: Lucide.Plus,
     Close: Lucide.X,
   };
   ```

4. Remove the destructured named exports (lines 107-182 in current file).

### Benefits

- Single import statement
- Cleaner component usage
- Easier to add new icons (one line in ICONS object)
- No more redundant "Icon" suffix everywhere

---

## Phase 2 (TBD): Use Original Lucide Names

**Goal:** Align icon names with Lucide's original naming, reducing cognitive overhead.

### Proposed Change

```typescript
// Instead of custom semantic names
const ICONS = {
  Add: Lucide.Plus,      // Why rename Plus to Add?
  Close: Lucide.X,       // Why rename X to Close?
  Search: Lucide.Search, // Already matches!
};

// Use Lucide names directly
const ICONS = {
  Plus: Lucide.Plus,
  X: Lucide.X,
  Search: Lucide.Search,
  ChevronDown: Lucide.ChevronDown,
  // etc.
};
```

### Usage Would Become

```typescript
import { Icon } from 'styles/icons';
<Icon.Plus />
<Icon.X />
<Icon.Search />
<Icon.ChevronDown />
```

### Questions to Consider

#### Q1: Would this simplify imports and be better for tree-shaking?

**Short answer:** Slightly, but not significantly.

**Analysis:**

- Currently: `import * as Lucide from 'lucide-react'` imports the entire Lucide namespace, then we pick what we need in the `ICONS` object. Bundlers (Vite/Rollup) are smart enough to tree-shake unused icons from the final bundle.
- With direct Lucide names: Same tree-shaking behavior. The bundler still only includes icons that are actually referenced in `ICONS`.
- **Conclusion:** Tree-shaking is equivalent either way. The benefit is **developer experience** (no mental mapping between custom names and Lucide names).

#### Q2: Could we import individual icons instead of `import *`?

```typescript
// Instead of
import * as Lucide from 'lucide-react';

// Use individual imports
import { Plus, X, Search, ChevronDown } from 'lucide-react';

const ICONS = {
  Plus,
  X,
  Search,
  ChevronDown,
};
```

**Pros:**

- Explicit about which icons are used
- Slightly cleaner (no `Lucide.` prefix)

**Cons:**

- Must add icon to two places (import + ICONS object)
- With `import *`, you only add to ICONS object

**Verdict:** `import *` is fine. Modern bundlers handle tree-shaking well. The simplicity of adding icons in one place (ICONS object) outweighs the marginal benefit of explicit imports.

---

## Phase 3 (TBD): Semantic Aliases

**Goal:** Keep some semantic aliases for app-specific naming while using Lucide names as the default. All accessible via single `Icon` export.

### Proposed Implementation

```typescript
import * as Lucide from 'lucide-react';
import { createIconWrapper } from './icons.utils';

// ============================================================================
// PRIMARY ICONS - Lucide names (single source of truth)
// ============================================================================

const ICONS = {
  Plus: Lucide.Plus,
  X: Lucide.X,
  Search: Lucide.Search,
  ChevronDown: Lucide.ChevronDown,
  ChevronUp: Lucide.ChevronUp,
  Trash2: Lucide.Trash2,
  Menu: Lucide.Menu,
  // ... all Lucide names
} as const;

// Wrap all icons
type IconKeys = keyof typeof ICONS;
type WrappedIconMap = { [K in IconKeys]: ReturnType<typeof createIconWrapper> };

const wrappedIcons = Object.fromEntries(
  Object.entries(ICONS).map(([name, icon]) => [name, createIconWrapper(icon, name)])
) as WrappedIconMap;

// ============================================================================
// SEMANTIC ALIASES - App-specific names (easy to add/remove)
// ============================================================================
// These are merged into Icon export, so both Icon.Plus and Icon.Add work

const ALIASES = {
  Add: wrappedIcons.Plus,
  Close: wrappedIcons.X,
  Delete: wrappedIcons.X,
  Find: wrappedIcons.Search,
  Dropdown: wrappedIcons.ChevronDown,
  Trash: wrappedIcons.Trash2,
} as const;

// ============================================================================
// SINGLE EXPORT - Lucide names + aliases merged
// ============================================================================

export const Icon = {
  ...wrappedIcons,  // Lucide names (primary)
  ...ALIASES,       // Semantic aliases (convenience)
} as const;
```

### Usage

```typescript
import { Icon } from 'styles/icons';

// Lucide names (recommended, matches docs)
<Icon.Plus />
<Icon.X />
<Icon.Search />

// Semantic aliases (also work, same icons)
<Icon.Add />      // → Plus
<Icon.Close />    // → X
<Icon.Delete />   // → X
<Icon.Find />     // → Search
```

### Benefits of This Approach

1. **Single import, single export** — just `Icon`
2. **Primary usage matches Lucide docs** — easy to find icons on lucide.dev
3. **Aliases are in a separate block** — easy to add/remove/audit
4. **Both names work** — `Icon.Plus` and `Icon.Add` are the same component
5. **Easy to add new icons** — just add to ICONS
6. **Easy to add aliases** — just add to ALIASES
7. **Easy to remove aliases** — delete from ALIASES, grep for usages, update

---

## Migration Checklist

### Phase 1: `Icon.X` Pattern

- [ ] Update `icons.ts` to export `Icon` object
- [ ] Remove "Icon" suffix from all ICONS keys
- [ ] Remove destructured named exports
- [ ] Update all imports across codebase (use find/replace)
- [ ] Delete `icons-V1.ts` backup file
- [ ] Test all icon usages

### Phase 2: Lucide Names (TBD)

- [ ] Decide if semantic renames add value or just confusion
- [ ] Rename ICONS keys to match Lucide originals
- [ ] Update all usages
- [ ] Update this documentation

### Phase 3: Semantic Aliases (TBD)

- [ ] Identify which aliases are actually useful
- [ ] Create `ALIASES` object (separate block, easy to maintain)
- [ ] Merge into `Icon` export: `{ ...wrappedIcons, ...ALIASES }`
- [ ] Both `Icon.Plus` and `Icon.Add` now work

---

## File References

- Current icons: `apps/client/src/styles/icons/icons.ts`
- Wrapper utility: `apps/client/src/styles/icons/icons.utils.ts`
- Lucide docs: <https://lucide.dev/icons/>
