# Plan: Migrate app notifications to `@finografic/design-system` Toast

## Confirmation (scan)

- **Touch client** uses only `apps/client/src/components/Toast/` (`ToastProvider`, `useToast`, `Toaster`, Emotion styles). Nothing imports `Toast` / `Toaster` / `createToaster` from `@finografic/design-system/components`.
- **Design system** exposes Ark-based primitives: `createToaster`, `Toaster`, compound `Toast` (`Root`, `Title`, `Description`, `CloseTrigger`, `ActionTrigger`) plus `toastRecipe` (Panda). See `packages/design-system/src/components/toast/toast.tsx`.

So: **DS toast is not used today**; current UI is legacy Emotion + custom context. Migrating would replace that stack, not “layer” DS styles on top of the old provider without refactoring.

## Why migrate

- One visual + motion system (`toastRecipe`, tokens, Ark-managed open/close).
- Less custom CSS to maintain; aligns with DS `Button`-style consolidation.
- Exit animation and stacking are handled by **Ark** + recipe (`_open` / `_closed`); verify once for `animation-fill-mode` if any flicker appears (same class of bug as the Emotion `forwards` fix).

## API gap (map before coding)

| Current (`ToastContext`) | DS / Ark (typical) |
| ------------------------- | ------------------ |
| `toast({ variant, message, subText, icon, duration, action })` | `toaster.create({ type, title, description?, duration?, action? })` — confirm exact `createToaster` options in Ark + DS types. |
| Variants: `info` \| `success` \| `error` \| `warning` | Usually `type` / `status` aligned with `toastRecipe` variants. |
| Custom `icon` override | Custom `render` on `Toaster` or pass content into description/title slots. |
| `dismiss` / `dismissAll` | Toaster instance API (`dismiss` / `remove` — confirm in Ark docs). |

## Implementation phases

### 1. Spike (single branch / small PR)

- Add `createToaster({ placement: 'bottom-end' })` (or match current fixed position) in a module, e.g. `src/components/Toast/toaster-instance.ts`.
- In `App.tsx`, render **DS** `<Toaster toaster={…} />` **alongside** (or instead of) the old one behind a feature flag if desired.
- Implement a **`render`** prop that composes `Toast.Root` / `Title` / `Description` / `CloseTrigger` / optional `ActionTrigger` so visuals match product needs.
- Ensure DS **global styles** for toast animations are loaded (same entry as other `@finografic/design-system` components — follow existing `forms.css` / app CSS imports).

### 2. Compatibility layer

- Implement **`useToast`** again as a thin wrapper: `toast(config)` → `toaster.create(mappedConfig)` so dozens of call sites do not change in one shot (optional but recommended).
- Map `message` → `title`, `subText` → `description`, `variant` → Ark `type`.
- Re-implement `dismissAll` via toaster API once confirmed.

### 3. Rollout

- Switch `App.tsx` to DS `Toaster` only; remove `ToastProvider` + custom `Toaster` + Emotion toast list when the wrapper is stable.
- Delete or shrink `Toast.styles.ts` / `Toast.tsx` if unused; keep `Toast.types.ts` only if still exported for consumers.

### 4. QA

- Auto-dismiss, manual close, multiple concurrent toasts, action button, custom icon, long text.
- Keyboard / screen reader (Ark roles + close control).
- Visual regression vs current placement (viewport padding, z-index).

## Risks / notes

- **Placement**: Current viewport is `fixed` bottom-right with custom offsets; DS `Toaster` + `placement` must be tuned to match.
- **Emotion**: Removing Emotion from toast does not remove Emotion from the rest of the app; only this subtree stops needing it for notifications.
