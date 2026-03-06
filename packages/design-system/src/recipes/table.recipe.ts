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
import { defineSlotRecipe } from '@pandacss/dev';

export const tableRecipe = defineSlotRecipe({
  className: 'table',
  description: 'Data table — headless-compatible, pairs with TanStack Table',

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
      tableLayout: 'auto',
      textIndent: '0',
    },

    caption: {
      // visually hidden but available to screen readers
      position: 'absolute',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      whiteSpace: 'nowrap',
    },

    thead: {
      borderBottomWidth: 'light',
      borderBottomStyle: 'solid',
      borderBottomColor: 'border',
    },

    tbody: {
      // rows handle their own bottom borders
    },

    tfoot: {
      borderTopWidth: 'light',
      borderTopStyle: 'solid',
      borderTopColor: 'border',
      bg: 'bg.subtle',
      fontWeight: 'semibold',
    },

    headerRow: {
      bg: 'bg.subtle',
    },

    tr: {
      borderBottomWidth: 'light',
      borderBottomStyle: 'solid',
      borderBottomColor: 'border.subtle',
      transition: 'background 120ms ease',

      _last: {
        borderBottomWidth: '0',
      },

      _hover: {
        bg: 'bg.hover',
      },

      // row selection — set data-selected="true" on the <tr>
      '&[data-selected="true"]': {
        bg: 'accent.subtle',
        _hover: {
          bg: 'accent.muted',
        },
      },
    },

    th: {
      position: 'relative',
      textAlign: 'left',
      fontWeight: 'semibold',
      color: 'fg.muted',
      fontSize: 'xs',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      userSelect: 'none',

      // sortable — add onClick from TanStack when column.getCanSort()
      '&[data-sortable="true"]': {
        cursor: 'pointer',
        _hover: {
          color: 'fg',
        },
      },
    },

    td: {
      color: 'fg',
      verticalAlign: 'middle',
    },

    sortIcon: {
      display: 'inline-flex',
      alignItems: 'center',
      marginInlineStart: '1',
      color: 'fg.subtle',
      flexShrink: 0,

      // dim when unsorted, full opacity when active
      '&[data-sort="false"]': {
        opacity: 0.4,
      },
      '&[data-sort="asc"], &[data-sort="desc"]': {
        opacity: 1,
        color: 'accent.solid',
      },
    },

    emptyState: {
      textAlign: 'center',
      color: 'fg.subtle',
      fontSize: 'sm',
    },
  },

  variants: {
    // ── Size ────────────────────────────────────────────────────────
    // Drives cell padding and font size. 'sm' is good for data-dense
    // dashboard tables (Pi 800×480), 'md' for standard admin views.
    size: {
      sm: {
        th: { px: '3', py: '2', fontSize: 'xs' },
        td: { px: '3', py: '1.5', fontSize: 'sm' },
        emptyState: { px: '3', py: '6', fontSize: 'sm' },
        tfoot: { },
      },
      md: {
        th: { px: '4', py: '3', fontSize: 'xs' },
        td: { px: '4', py: '2.5', fontSize: 'sm' },
        emptyState: { px: '4', py: '8', fontSize: 'sm' },
      },
      lg: {
        th: { px: '5', py: '4', fontSize: 'sm' },
        td: { px: '5', py: '3', fontSize: 'md' },
        emptyState: { px: '5', py: '10', fontSize: 'md' },
      },
    },

    // ── Striped ─────────────────────────────────────────────────────
    // Alternating row background for easier row tracking in wide tables.
    striped: {
      true: {
        tr: {
          '&:nth-child(even)': {
            bg: 'bg.subtle',
            _hover: {
              bg: 'bg.hover',
            },
          },
        },
      },
    },

    // ── Bordered ────────────────────────────────────────────────────
    // Adds vertical column dividers. Useful for very wide tables with
    // many columns where horizontal scanning is hard.
    bordered: {
      true: {
        th: {
          borderRightWidth: 'light',
          borderRightStyle: 'solid',
          borderRightColor: 'border.subtle',
          _last: { borderRightWidth: '0' },
        },
        td: {
          borderRightWidth: 'light',
          borderRightStyle: 'solid',
          borderRightColor: 'border.subtle',
          _last: { borderRightWidth: '0' },
        },
      },
    },

    // ── Sticky header ────────────────────────────────────────────────
    // Keeps thead visible when the table overflows vertically.
    // Pair with a fixed height + overflow-y: auto on root.
    stickyHeader: {
      true: {
        thead: {
          position: 'sticky',
          top: '0',
          zIndex: 'docked',
          // re-apply bg since sticky loses the thead background without it
          bg: 'bg.subtle',
        },
      },
    },
  },

  defaultVariants: {
    size: 'md',
    striped: false,
    bordered: false,
    stickyHeader: false,
  },
});
