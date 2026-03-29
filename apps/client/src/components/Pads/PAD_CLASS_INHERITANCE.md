# Pad / slot class & CSS inheritance

Summary of how main-grid pads get **base chrome** vs **slot-specific** layers. Detailed diagrams live in `apps/client/docs/pad-slot-style-inheritance.md`.

---

## 1. Inheritance chain (why it felt “stacked” before)

**Problem (fixed):** `PadSlot` passed `css={styles}` into `Pad`, but **`PadCheckbox` used only base pad CSS** — slot rules did not always apply. **`PadSlotToggle` also ignored `css`**, so timer pads had the same gap.

**Current chain:**

| Path | `className` | `css` (Emotion) |
| ---- | ----------- | --------------- |
| **Idle relay pad** | `pad` `checkbox` `pad-slot` `item-type-…` `pad-large?` `pad-special-*?` `status-*` | `[ padStyles, PadSlot.styles ]` — `padStyles` = `&.pad { stylesPad → stylesButtonBase }` |
| **Timer relay pad** | same pattern on `PadSlotToggle` | `PadSlot.styles` only (no `padStyles` on that `div`) |

So **`stylesButtonBase`** still applies on idle pads via **`padStyles`** → **`stylesPad`**; **`PadSlot.styles` is merged after** for `item-type-*` / specials / timers.

---

## 2. Where styles live (one file for pad chrome)

All of this is in **`Pad/PadBasic.styles.ts`**:

| Export | Purpose |
| ------ | ------- |
| `padProps` | Width/height tokens (`pad`, `padLG`, `special`) — shared with `PadSlot`, `PadPower`, `MainSlotGrid`, responsive scaling. |
| `stylesPad` | Core look: `stylesButtonBase` + typography + checked state. Also composed inside `PadSlot.styles` and `PadAction.styles`. |
| `padStyles` | Wraps `stylesPad` under `&.pad` + `border-radius` + `user-select`. Used by **`PadCheckbox`**, **`PadRadio`**, **`PadButton`**. |
| `stylesPadBasic` | **Different concern:** numeric / time / temperature step UIs (`PadNumeric`, `PadTimeGroup`, `PadTemperature`) — not main-grid relay pads. |

`Pad.styles.ts` was removed; it only duplicated the `padStyles` wrapper and imported `stylesPad` from the same file.

---

## 3. `item-type-Alt` + `SlotSpecial.ALT`

- **`PadSlot`** emits `` `item-type-${slotType}` ``; **`MainSlotGrid`** passes **`SlotSpecial.ALT`** for ALT pads and **`resolveMainPageSlotType(...)`** for grid slots.
- **`resolveMainPageSlotType`** in `slots.config.ts` ties slot **16** to **`SlotSpecial.ALT`** where needed.
- **`PadSlot.styles`**: `.item-type-Alt` uses the secondary palette; **`.pad-special-alt`** is a layout hook only (see comments in CSS).

---

## 4. Related docs

- **Mermaid + ASCII:** `apps/client/docs/pad-slot-style-inheritance.md`
- **Relay domain:** `docs/relays/` (hardware / client / server)
