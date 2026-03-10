# 1️⃣ DataTable anatomy

Correct choice:

```
Slot Recipe
```

Because the table has slots:

```
table
thead
tbody
row
cell
headerCell
filterRow
pagination
```

------

# 2️⃣ DataTable architecture in your design system

Your DS already has a nice structure.

Add this:

```
src/components
  DataTable
    DataTable.tsx
    DataTable.types.ts
    DataTable.context.ts
    DataTable.column.ts
    index.ts
```

Recipes:

```
src/recipes
  datatable.recipe.ts
```

------

### Resulting DS structure

```
design-system
  src
    components
      DataTable
        DataTable.tsx
        DataTable.column.ts
        DataTable.types.ts
        index.ts
    recipes
      datatable.recipe.ts
```

------

# 3️⃣ Where styling lives

You asked an excellent question.

Correct flow:

```
design tokens
      ↓
recipe
      ↓
component
```

Example:

```
tokens/colors.tokens.ts
tokens/spacing.tokens.ts
```

Recipe uses tokens:

```
datatable.recipe.ts
```

Component consumes recipe:

```
DataTable.tsx
```

------

# 4️⃣ Slot Recipe (drop-in)

```
src/recipes/datatable.recipe.ts
import { sva } from '../styled-system/css'

export const dataTableRecipe = sva({
  slots: [
    'root',
    'table',
    'thead',
    'tbody',
    'row',
    'headerCell',
    'cell',
    'toolbar',
    'pagination'
  ],

  base: {
    root: {
      width: 'full',
      borderRadius: 'lg',
      overflow: 'hidden'
    },

    table: {
      width: 'full',
      borderCollapse: 'collapse'
    },

    thead: {
      bg: 'bg.subtle'
    },

    row: {
      borderBottom: '1px solid',
      borderColor: 'border.muted',
      _hover: {
        bg: 'bg.muted'
      }
    },

    headerCell: {
      textAlign: 'left',
      fontWeight: 'medium',
      px: '4',
      py: '3',
      cursor: 'pointer'
    },

    cell: {
      px: '4',
      py: '3'
    }
  },

  variants: {
    size: {
      sm: {
        cell: { py: '2' },
        headerCell: { py: '2' }
      },
      md: {},
      lg: {
        cell: { py: '4' },
        headerCell: { py: '4' }
      }
    },

    striped: {
      true: {
        row: {
          '&:nth-of-type(even)': {
            bg: 'bg.subtle'
          }
        }
      }
    }
  },

  defaultVariants: {
    size: 'md'
  }
})
```

------

# 5️⃣ TanStack DataTable component

```
src/components/DataTable/DataTable.tsx
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table'

import { dataTableRecipe } from '../../recipes/datatable.recipe'

export function DataTable({
  data,
  columns
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  })

  const styles = dataTableRecipe()

  return (
    <div className={styles.root()}>
      <table className={styles.table()}>
        <thead className={styles.thead()}>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className={styles.headerCell()}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className={styles.tbody()}>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className={styles.row()}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={styles.cell()}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

------

# 6️⃣ Column definition

```
DataTable.column.ts
import { ColumnDef } from '@tanstack/react-table'

export type DataTableColumn<T> = ColumnDef<T>
```

------

# 7️⃣ Usage example

```tsx
const columns = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'category',
    header: 'Category'
  },
  {
    accessorKey: 'price',
    header: 'Price'
  }
]

<DataTable
  data={products}
  columns={columns}
/>
```

------

# 8️⃣ Filtering (TanStack)

Add to table config:

```ts
import { getFilteredRowModel } from '@tanstack/react-table'

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel()
})
```

------

# 9️⃣ Row selection

Add:

```ts
import { getCoreRowModel } from '@tanstack/react-table'

const table = useReactTable({
  data,
  columns,
  enableRowSelection: true
})
```

Matches PrimeReact's row selection behavior described in their docs .

------

# 10️⃣ Components you *should extract*

From the DataTable:

```
Paginator
Table
Checkbox
ColumnHeader
FilterInput
```

These become reusable primitives in your DS.

------

# Final architecture (ideal)

```
design-system
  tokens
  recipes
    datatable.recipe.ts
  components
    DataTable
      DataTable.tsx
      DataTable.types.ts
      DataTable.column.ts
    Table
    Checkbox
    Paginator
```

------

