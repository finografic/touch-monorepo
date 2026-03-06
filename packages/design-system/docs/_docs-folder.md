# design-system `docs/`

Based on what's already in the package and where it's heading, suggested structure:

```
docs/
  # Already exists
  design-token-scales-reference.md
  grid.md
  DATATABLE.example.md

  # Tokens
  tokens/
    colors.md          — semantic token roles (bg, fg, border, accent), dark mode, colorPalette pattern
    spacing.md         — scale reference, semantic spacing tokens (when implemented)
    typography.md      — font scale, textStyles, usage in recipes vs raw tokens

  # Recipes
  recipes/
    overview.md        — what a recipe is, slot vs non-slot, how codegen works, the cls pattern
    button.md          — all variants table, colorScheme × variant matrix, icon usage
    table.md           — move DATATABLE.example.md here, rename to table.md
    forms.md           — input, label, form-field, select together (they're always used as a unit)

  # Components
  components/
    overview.md        — Ark UI relationship, recipe-first philosophy, when to use component vs raw ark
    forms.md           — compound form components (FieldBox, InputField, SelectSearchable etc), form.css

  # System
  icons.md             — registry pattern, how to add an icon, icon sizing classes, picker.html
  viewport.md          — breakpoints, min/max helpers, Emotion usage, Pi display targets
  palette.md           — OKLCH generator, how to add/modify a color, shade scale explained
  dark-mode.md         — data-theme="dark" convention, semantic token structure, condition in panda.config
```

## Documentation tips

**Flat over deep for system-level docs.** `icons.md`, `viewport.md`, `palette.md`, `dark-mode.md` live at the root of `docs/` rather than in subfolders — they're cross-cutting concerns, not part of a category.

**`recipes/overview.md` first.** The mental model of how recipes work (static codegen, class strings, slot vs non-slot, no runtime) is the thing a new contributor needs before any individual recipe doc makes sense. One overview unlocks all the others.

**Forms grouped, not split.** `input`, `label`, `form-field`, `select` are rarely used in isolation — they're always composed. One doc covering them together is more useful than four thin docs. Same logic applies to the compound form components.

**`table.md` not `DATATABLE.example.md`.** Once it lives in `recipes/`, the filename should match the convention of the other recipe docs. The "example" suffix made sense as a standalone deliverable but not in a structured docs folder.

**Skip documenting every recipe individually** — `badge`, `callout`, `card`, `text`, `tooltip` etc. are simple enough that the recipe source file's JSDoc is sufficient. Save dedicated docs for things with real complexity: button (colorScheme matrix), table (TanStack integration), forms (compound component system).
