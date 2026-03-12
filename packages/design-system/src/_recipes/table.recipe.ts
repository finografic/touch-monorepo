/**
 * Table Recipe (Slot Recipe)
 *
 * Headless-first table styling, designed to pair with TanStack Table
 * (or any other table logic layer). This recipe owns ALL visual chrome —
 * layout, borders, spacing, colors, sort indicators, hover/selected states.
 *
 * TanStack Table provides zero markup — you render `<table>`, `<thead>`,
 * `<tr>`, `<th>`, `<td>` yourself and apply these class names.
 *
 * Slots:
 *   root        — outer scroll wrapper (handles overflow-x on small viewports)
 *   table       — the <table> element itself
 *   thead       — <thead>
 *   tbody       — <tbody>
 *   tfoot       — <tfoot> (optional totals / summary row)
 *   tr          — <tr> in tbody (hover + selected state)
 *   headerRow   — <tr> inside thead (no hover)
 *   th          — <th> — sortable column header cell
 *   td          — <td> — data cell
 *   sortIcon    — icon wrapper inside <th> (asc/desc/unsorted indicator)
 *   emptyState  — full-width cell content when there are no rows
 *   caption     — <caption> element (screen-reader-friendly table title)
 *
 * Usage:
 * ```tsx
 * import { tableRecipe } from '@workspace/design-system/recipes';
 *
 * const cls = tableRecipe({ size: 'sm', striped: true });
 *
 * <div className={cls.root}>
 *   <table className={cls.table}>
 *     <thead>
 *       <tr className={cls.headerRow}>
 *         <th className={cls.th} onClick={header.column.getToggleSortingHandler()}>
 *           Name
 *           <span className={cls.sortIcon} data-sort={column.getIsSorted()}>
 *             <ChevronsUpDown />
 *           </span>
 *         </th>
 *       </tr>
 *     </thead>
 *     <tbody>
 *       {rows.map(row => (
 *         <tr key={row.id} className={cls.tr} data-selected={row.getIsSelected()}>
 *           {row.getVisibleCells().map(cell => (
 *             <td key={cell.id} className={cls.td}>
 *               {flexRender(cell.column.columnDef.cell, cell.getContext())}
 *             </td>
 *           ))}
 *         </tr>
 *       ))}
 *     </tbody>
 *   </table>
 * </div>
 * ```
 *
 * Sort icon data attribute convention:
 *   data-sort="asc"   → show ascending arrow
 *   data-sort="desc"  → show descending arrow
 *   data-sort="false" → show neutral indicator (unsorted)
 *
 * Selected row convention:
 *   data-selected="true" on <tr> → accent highlight
 */
import { sva } from '../../styled-system/css';

export const tableRecipe = sva({
  className: 'table',

  // description: 'Data table — headless-compatible, pairs with TanStack Table',

  slots: [
    'root',
    'table',
    'thead',
    'tbody',
    'tfoot',
    'tr',
    'headerRow',
    'th',
    'td',
    'sortIcon',
    'emptyState',
    'caption',
  ],

  base: {
    root: {
      width: '100%',
      overflowX: 'auto',
      borderWidth: 'light',
      borderStyle: 'solid',
      borderColor: 'border',
      borderRadius: 'md',
    },

    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },

    thead: {
      borderBottomWidth: 'light',
      borderBottomStyle: 'solid',
      borderBottomColor: 'border',
    },

    headerRow: {
      bg: 'bg.muted',
    },

    tr: {
      borderBottomWidth: 'light',
      borderBottomStyle: 'solid',
      borderBottomColor: 'border.subtle',

      _hover: {
        bg: 'bg.hover',
      },
    },

    th: {
      textAlign: 'left',
      fontWeight: 'semibold',
      color: 'fg.muted',
      px: '3',
      py: '2',
    },

    td: {
      px: '3',
      py: '2',
    },

    sortIcon: {
      opacity: 0.6,
    },

    emptyState: {
      textAlign: 'center',
      py: '6',
      color: 'fg.muted',
    },
  },
});
