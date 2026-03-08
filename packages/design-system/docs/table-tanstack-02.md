```
# USER
Ok, perfect..  Could you show me how a filter input in header would look, when combined with the table recipe? Are the separate recipes combine in the implementation, or…?  I’m still new to panda css, recipes , etc..
```

Good question — this is exactly where the mental model matters. Let me show you concretely.
    
------
    
## How recipes compose — the mental model
    
A recipe just returns class name strings. `tableRecipe()` returns `{ th: "table__th ...", td: "table__td ...", ... }`. `inputRecipe()` returns a single string like `"input input--sm"`. They're completely independent — there's no Panda-specific composition API. You just apply both to whatever element needs them.
   

```tsx
    const cls = tableRecipe({ size: 'sm' });
    const filterInput = inputRecipe({ size: 'sm' });
    
    <th className={cls.th}>
    Name
      <input className={filterInput} ... />
    </th>
```
    
That's it. The `th` gets the table header styles, the `input` inside it gets the input styles. No magic, no nesting API — just two independent class strings on two different elements.
    
------
    
## What a filterable header actually looks like

```tsx
    // OrdersTable.tsx
    import {
    useReactTable,
      getCoreRowModel,
    getSortedRowModel,
      getFilteredRowModel,
    flexRender,
    } from '@tanstack/react-table';
    import { tableRecipe } from '@workspace/design-system/recipes';
    import { inputRecipe } from '@workspace/design-system/recipes';
    import { ChevronsUpDownIcon, ArrowUpIcon, ArrowDownIcon } from '@workspace/icons';

  
  const cls = tableRecipe({ size: 'sm', stickyHeader: true });
    const filterInput = inputRecipe({ size: 'sm' });

    function FilterableHeader({ column, label }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
      
          {/* Sort trigger row */}
        <div
            onClick={column.getToggleSortingHandler()}
          data-sortable="true"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}
        >
            {label}
          <span className={cls.sortIcon} data-sort={String(column.getIsSorted())}>
              {{ asc: <ArrowUp />, desc: <ArrowDown /> }[column.getIsSorted()] ?? <ChevronsUpDown />}
          </span>
          </div>
        
        {/* Filter input — only rendered if column.getCanFilter() */}
          {column.getCanFilter() && (
          <input
              className={filterInput}
              value={column.getFilterValue() ?? ''}
              onChange={e => column.setFilterValue(e.target.value)}
              placeholder={`Filter…`}
              onClick={e => e.stopPropagation()} // don't trigger sort on input click
          />
          )}
      
        </div>
    );
    }
```
  
Then in your column definitions:
  

```ts
    const columns = [
      {
        accessorKey: 'name',
        header: ({ column }) => <FilterableHeader column={column} label="Name" />,
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <FilterableHeader column={column} label="Status" />,
      // no filter on this column — getCanFilter() returns false → input not rendered
        enableColumnFilter: false,
    },
    ]
```

------

  ## Where the `th` padding becomes relevant

  Your `tableRecipe` `th` has `py: '2'` (size sm). Once you stack a label row + an input inside the `th`, that padding is on the `th` itself — it wraps both. No adjustment needed unless the header rows feel too tight, in which case you'd either bump `size` to `md` or do a one-off Emotion override in `OrdersTable.styles.ts`:

```ts
    // OrdersTable.styles.ts — only if you need to tweak for this specific table
  export const tableOverrides = css`
      .table__th {
      padding-block: var(--spacing-3);
      }
  `;
```

That's the Emotion role — it's not composing recipes, it's tweaking a specific table's chrome after the fact. The recipe handles the 95%, Emotion handles the per-table 5%.

------

## The key insight for Panda newcomers
      
Recipes don't know about each other. There's no "slot recipe nesting" or "recipe inheritance" API. Composition is just React — you render elements inside elements and apply whatever class names are appropriate to each one. The DS gives you a vocabulary of named class strings; you assemble them in markup.
      
The only "Panda-specific" composition is `cva` from your `styled-system` — that lets you merge multiple Panda-generated class strings together (`cx(cls.th, someOtherClass)`). But for recipes + recipes, you just put them on the right elements.

```
# USER
Can you generate a DATATABLE.example.md instructions/ tutorial document that I will both use to make the table AND save to the DS docs?? Generate/alter any recipes missing, also..
```

Three files to drop in:
      
- `docs/DATATABLE.example.md` → drop into DS `docs/` folder alongside `grid.md`
- `src/icons/icons.ts` → replaces existing, adds `ArrowUpIcon`, `ArrowDownIcon`, `ArrowLeftIcon`, `ArrowRightIcon`, `ChevronsUpDownIcon`
- `src/icons/index.ts` → replaces existing, adds those same five as named exports
      
**After dropping these in**, run `pnpm build` in the DS package to get updated codegen and dist. The doc references the exact import paths, slot names, data attributes, and variant combinations as-built — no gaps between the tutorial and the actual recipe.
      
A few things the doc covers that are worth flagging:
      
- **Column definitions in a separate file** (`OrdersTable.columns.tsx`) — keeps the main component readable and makes the column config easy to find and extend
- **Recipe instances at module scope** — `const cls = tableRecipe(...)` is outside the component, so it's a stable string, not recomputed per render
- **`e.stopPropagation()` on filter inputs** — critical detail; without it clicking into the filter input triggers the sort handler on the `th`
- **Server-side pattern** at the bottom — `manualSorting/Filtering/Pagination` flags, for when you eventually have enough data that client-side filtering isn't viable
      
   
I know there are local instructions, rules that can be saved for Claude for online use... if this is the case, please create such a doc for your use... if not, and i don't quite have that correct, don't worry about it.
      
Also saved your naming conventions to memory so they'll carry through to future chats in this project — no need to re-explain them.
      
Without actually generating the docs, can you recommend an approx structure for the docs folder for this DS package?? Again, docs that cover more detail than what is included in the root README.md

Based on what's already in the package and where it's heading, here's what I'd suggest:

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

A few decisions baked into that structure worth calling out:

**Flat over deep for system-level docs.** `icons.md`, `viewport.md`, `palette.md`, `dark-mode.md` live at the root of `docs/` rather than in subfolders — they're cross-cutting concerns, not part of a category.

**`recipes/overview.md` first.** The mental model of how recipes work (static codegen, class strings, slot vs non-slot, no runtime) is the thing a new contributor needs before any individual recipe doc makes sense. One overview unlocks all the others.

**Forms grouped, not split.** `input`, `label`, `form-field`, `select` are rarely used in isolation — they're always composed. One doc covering them together is more useful than four thin docs. Same logic applies to the compound form components.

**`table.md` not `DATATABLE.example.md`.** Once it lives in `recipes/`, the filename should match the convention of the other recipe docs. The "example" suffix made sense as a standalone deliverable but not in a structured docs folder.

  Skip documenting every recipe individually** — `badge`, `callout`, `card`, `text`, `tooltip` etc. are simple enough that the recipe source file's JSDoc is sufficient. Save dedicated docs for things with real complexity: button (colorScheme matrix), table (TanStack integration), forms (compound component system).