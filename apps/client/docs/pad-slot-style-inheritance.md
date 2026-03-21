# Main pad / slot styling (inheritance)

Single source for **relay slot** appearance: `PadSlot.styles.ts` (`styles`), merged **after** base checkbox chrome in `Pad.styles.ts` (`padStyles` → `stylesPad` → `stylesButtonBase`).

## Mermaid: idle checkbox path (main grid pad)

```mermaid
flowchart TB
  subgraph dom["DOM node (one element)"]
    R["Checkbox.Root"]
  end

  R --> C["className: pad · checkbox · pad-slot · item-type-{A|B|C|Alt} · pad-large? · pad-special-*? · status-*"]
  R --> E["css: [ padStyles, PadSlot.styles ]"]

  subgraph padStyles["padStyles (Pad.styles.ts)"]
    P1["&.pad"]
    P2["stylesPad (PadBasic.styles.ts)"]
    P3["stylesButtonBase (button-base.styles.ts)"]
    P1 --> P2 --> P3
  end

  subgraph slotStyles["PadSlot.styles.ts"]
    S1["&.pad.pad-slot"]
    S2["item-type-A | B | C | Alt"]
    S3["pad-special-grid · timer status-*"]
    S1 --> S2
    S1 --> S3
  end

  E --> padStyles
  E --> slotStyles
```

## Mermaid: timer path

```mermaid
flowchart LR
  D["div (PadSlotToggle)"] --> E2["css: PadSlot.styles"]
  D --> C2["className: same item-type-* + status-* as idle"]
```

## ANSI (compact)

```
idle Pad:
  Checkbox.Root
    class: pad + checkbox + pad-slot + item-type-<SlotType|Alt> + …
    css:   [ padStyles → stylesPad → stylesButtonBase ,  PadSlot.styles → item-type-* ]

timer Pad:
  div (PadSlotToggle)
    class: pad + pad-slot + item-type-* + status-processing|…
    css:   PadSlot.styles
```

`item-type-Alt` comes from `SlotSpecial.ALT` (enum value `"Alt"`). Slot **16** is normalized via `resolveMainPageSlotType()` in `slots.config.ts`.
