import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@workspace/icons';

import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowSelectionState,
  type SortingState,
  type Updater,
  useReactTable,
} from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { Spinner } from '../spinner';
import { tableRecipe } from './data-table.recipe';
import type { DataTableProps } from './data-table.types';

interface SortIconProps {
  sorted: 'asc' | 'desc' | false;
  className?: string;
}

function SortIcon({ sorted, className }: SortIconProps) {
  return (
    <span className={className} data-sort={String(sorted)}>
      {sorted === 'asc' && <ArrowUpIcon className="icon icon-sm" />}
      {sorted === 'desc' && <ArrowDownIcon className="icon icon-sm" />}
      {!sorted && <ChevronsUpDownIcon className="icon icon-sm" />}
    </span>
  );
}

interface PaginationProps {
  'className'?: string;
  'disabled'?: boolean;
  'aria-label': string;
  'onClick': () => void;
  'children': ReactNode;
}

function PaginationButton({ className, disabled, children, ...rest }: PaginationProps) {
  return (
    <button className={className} disabled={disabled} type="button" {...rest}>
      {children}
    </button>
  );
}

export function DataTable<TData>({
  data,
  columns,
  classNames,
  caption,
  loading = false,
  pageSize = 20,
  emptyMessage = 'No results found.',
  getRowId,
  selectedRows,
  onSelectionChange,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({});

  const isSelectionControlled = Boolean(selectedRows && onSelectionChange);

  const controlledRowSelection: RowSelectionState = selectedRows
    ? Object.fromEntries(
        selectedRows.map((row, index) => {
          const id = getRowId?.(row, index) ?? ((row as any).id as string | undefined) ?? String(index);
          return [id, true];
        }),
      )
    : {};

  const effectiveRowSelection = isSelectionControlled ? controlledRowSelection : internalRowSelection;

  const handleRowSelectionChange = (updater: Updater<RowSelectionState>) => {
    const next = typeof updater === 'function' ? updater(effectiveRowSelection) : updater;

    if (isSelectionControlled && onSelectionChange) {
      const nextSelected = data.filter((row, index) => {
        const id = getRowId?.(row, index) ?? ((row as any).id as string | undefined) ?? String(index);
        return Boolean(next[id]);
      });
      onSelectionChange(nextSelected);
    } else {
      setInternalRowSelection(next);
    }
  };

  const table = useReactTable<TData>({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection: effectiveRowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: handleRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
    getRowId,
  });

  // const { table: tableClasses, filterInput, paginationButton } = classNames as DataTableClassNames;

  const styles = tableRecipe({ size: 'md' });
  const { filterInput, paginationButton } = classNames;

  const headerGroups = table.getHeaderGroups();
  const allColumns = table.getAllColumns();
  const rowModel = table.getRowModel();

  const hasRows = rowModel.rows.length > 0;
  const isLoading = loading;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
      <div className={styles.root}>
        <table className={styles.table}>
          {caption ? <caption className={styles.caption}>{caption}</caption> : null}

          <thead className={styles.thead}>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id} className={styles.headerRow}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const canFilter = header.column.getCanFilter();

                  return (
                    <th
                      key={header.id}
                      className={styles.th}
                      data-sortable={canSort ? 'true' : undefined}
                      style={{
                        width: header.getSize() !== 150 ? `${header.getSize()}px` : undefined,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-1)',
                        }}
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && (
                          <SortIcon
                            sorted={header.column.getIsSorted() as 'asc' | 'desc' | false}
                            className={styles.sortIcon}
                          />
                        )}
                      </div>

                      {canFilter && filterInput ? (
                        <input
                          className={filterInput}
                          value={(header.column.getFilterValue() as string) ?? ''}
                          onChange={(event) => header.column.setFilterValue(event.target.value)}
                          placeholder="Filter…"
                          onClick={(event) => event.stopPropagation()}
                          style={{
                            marginTop: 'var(--spacing-1)',
                            width: '100%',
                          }}
                        />
                      ) : null}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className={styles.tbody}>
            {isLoading ? (
              <tr className={styles.tr}>
                <td
                  className={styles.td}
                  colSpan={allColumns.length || 1}
                  style={{
                    textAlign: 'center',
                    padding: 'var(--spacing-8)',
                  }}
                >
                  <Spinner size={20} />
                </td>
              </tr>
            ) : !hasRows ? (
              <tr className={styles.tr}>
                <td className={styles.emptyState ?? styles.td} colSpan={allColumns.length || 1}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rowModel.rows.map((row) => (
                <tr
                  key={row.id}
                  className={styles.tr}
                  data-selected={row.getIsSelected() ? 'true' : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={styles.td}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--spacing-2)',
          fontSize: 'var(--font-sizes-sm)',
          color: 'var(--colors-fg-muted)',
        }}
      >
        <span>
          {table.getFilteredSelectedRowModel().rows.length > 0 &&
            `${table.getFilteredSelectedRowModel().rows.length} of `}
          {table.getFilteredRowModel().rows.length} row(s)
        </span>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-1)',
          }}
        >
          <PaginationButton
            className={paginationButton}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="First page"
          >
            <DoubleArrowLeftIcon className="icon icon-sm" />
          </PaginationButton>

          <PaginationButton
            className={paginationButton}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="icon icon-sm" />
          </PaginationButton>

          <span style={{ paddingInline: 'var(--spacing-2)' }}>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>

          <PaginationButton
            className={paginationButton}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            <ChevronRightIcon className="icon icon-sm" />
          </PaginationButton>

          <PaginationButton
            className={paginationButton}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Last page"
          >
            <DoubleArrowRightIcon className="icon icon-sm" />
          </PaginationButton>
        </div>
      </div>
    </div>
  );
}
