# Orders DataTable (Design System v2)

This folder contains the **v2 Orders table**, built on top of the new design‑system `DataTable` component and PandaCSS recipes.

## Structure

- `OrdersTable.tsx` — feature wrapper around `DataTable`:
  - Wires in:
    - Orders domain hooks (`useOrdersFilter`, `useTableLabelMappings`, `useAppConfig`)
    - Orders column factory (`createOrdersColumns`)
    - Controlled row selection (`selectedOrders` / `onSelectionChange`)
  - Supplies all visual chrome via recipes:
    - `tableRecipe({ size: 'sm', striped: true, stickyHeader: true })`
    - `input({ size: 'sm' })` for per‑column filters
    - `button({ size: 'xs', variant: 'ghost' })` for pagination
    - `checkbox({ size: 'sm' })` for row selection

## Styling model

All layout and color comes from **design‑system tokens + recipes**:

- `tableRecipe` controls:
  - Header, body, and footer paddings
  - Row height, striping, hover, and selected states
  - Sort icon wrapper and empty state layout
- `inputRecipe` controls filter inputs inside header cells.
- `buttonRecipe` and `checkboxRecipe` style action buttons and selection checkboxes.

For Orders specifically, we add a few **page‑local tweaks** in `AdminOrdersPage.styles.ts`:

- Slightly smaller header typography and tighter table typography.
- Consistent 0.5rem × 0.75rem cell padding (header + body).
- Larger action icons with 0.25rem vertical button padding.

These overrides are **scoped to the Orders page** so other tables using `tableRecipe` are unaffected.

## Versioning

- `OrdersTableV1/` — original TanStack Table + recipes implementation (kept for reference).
- `OrdersTable/` — current, atomised implementation using the shared design‑system `DataTable` component.

The route `AdminOrdersListPage` now imports from `./OrdersTable`, so v2 is the default going forward.
