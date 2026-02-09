# CSS Touch Checkbox / Pad Slot Fix

## Problem

On touch devices (e.g. Raspberry Pi with Chromium), `:hover` styles cause a **sticky hover** effect: after tapping a pad/checkbox, the element stays in the hover state until another element is tapped. This happens because touch devices don't fire a "mouse leave" event, so the browser never clears the hover state.

Additionally, `@media (hover: hover)` does **not** reliably fix this on embedded Chromium (e.g. Pi), which may incorrectly report `hover: hover` even for touch screens.

## Solution

**Use state-based selectors only — no `:hover`.**

Pad slots and checkboxes are styled based on their checked/selected state, not hover:

- `.checked` — class added by PadCheckbox when checked
- `.selected` — class from PadSlot mergedClassNames (timer slots)
- `.active` — class from PadSlotToggle (timer slots)
- `[data-state="checked"]` — Radix UI Checkbox.Root
- `[aria-checked="true"]` — accessibility attribute

## Files Changed (Done)

| File | Changes |
|------|---------|
| `PadSlot.styles.ts` | Removed all `@media (hover: hover)` and `:hover` rules. State selectors for item-type-A/B/C and status-error. |
| `PadBasic.styles.ts` | Removed hover block. Added `[data-state='checked']` and `[aria-checked='true']` to state selectors. |
| `theme.css` | Comment updated to describe approach. |

## Behaviour

| Device | Input | Result |
|--------|-------|--------|
| Pi | Touch | Toggles correctly — state-based styling only |
| Pi | Mouse | Toggles correctly — state-based styling only |
| Local (desktop) | Mouse | Toggles correctly — state-based styling only |

No hover feedback on any device, but the toggle state and visual feedback work consistently everywhere.

---

## Candidates for Same Fix (Pi Touch Screen)

Components that use `checked` / `selected` + `:hover` and may appear on the Pi front-end:

| File | Role | Status |
|------|------|--------|
| **MainPageSlotGrid.styles.ts** | Power button on main page | **Fixed** — state-based selectors only |
| **LanguageSelector.styles.ts** | Language radio in UserToolbar dialog | **Fixed** — state-based selectors only |
| **PadPower.styles.ts** | Power pad | Unused — PadPower uses PadSlot.styles |

### Other Components (Admin / Forms — Lower Pi Priority)

- `OrdersTable.styles.ts` — `input[type='checkbox']:checked` + hover (admin)
- `AdminRelaysPage` — relay toggle (admin)
- `AdminLanguagesPage` — LanguagesList `checked` (admin)
- Forms (SelectWithNew, SelectAlt, etc.) — admin/forms, less likely on Pi touch

---

## Future: Restore Hover for Mouse Only

To add hover feedback back for mouse users (desktop) while keeping touch clean:

1. Add touch detection in `theme-init.js`: `document.documentElement.classList.add('is-touch')` when `'ontouchstart' in window || navigator.maxTouchPoints > 0`
2. Wrap hover rules in `html:not(.is-touch)` so they only apply when touch is not detected
