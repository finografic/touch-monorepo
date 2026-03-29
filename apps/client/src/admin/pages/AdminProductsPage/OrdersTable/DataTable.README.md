# Orders `DataTable` (design system)

This folder is the **orders list table** for admin: a thin wrapper around `@finografic/design-system` **`DataTable`**, with PandaCSS recipes for table / filter inputs / pagination controls.

## Layout

| File | Role |
| ---- | ---- |
| `OrdersTable.tsx` | Wires `DataTable`, `useTableHeaders()` (i18n column titles), `useTableLabelMappings`, and `createOrdersColumns`. |
| `orders-table.columns.tsx` | TanStack-style `ColumnDef` factory (selection, data columns, actions). |
| `orders-table.types.ts` | `ColumnKey`, `ColumnSearchState` — shared with `hooks/useOrdersFilter`. |
| `useTableLabelMappings.ts` | Value→label resolution for mode, drink types, volumes, etc. |
| `index.ts` | Exports `OrdersTable` + types for consumers (`AdminOrdersListPage`, `useOrdersFilter`). |
| `mocks/` | Optional examples (`TabList.EXAMPLE.tsx`, column filter examples) — not imported by routes. |

Legacy **`OrdersTableV1/`** (duplicate TanStack-only table) has been removed; column logic lives here next to the DS wrapper.

## Styling

Recipes: `table({ size, striped, stickyHeader })`, `input` for header filters, `button` for pagination — see `OrdersTable.tsx` `classNames` mapping.

Page-specific typography tweaks (if any) stay in the parent page styles file, not here.

## Design system

For `DataTable` API, props, and DS changelog, see the design-system package README at the monorepo sibling **`@finografic/design-system`** (not vendored in this repo path in every clone).
