import React, { useEffect, useMemo, useState } from 'react';
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
import { useTableHeaders } from 'admin/hooks/useTableHeaders';
import { button, input, table as tableRecipe } from 'styled-system/recipes';

import { useAppConfig } from 'providers/AppConfigProvider';

import type { OrderReadableWithIndex } from '../hooks/useOrdersFilter';
import { createOrdersColumns } from './OrdersTable.columns';
import { useTableLabelMappings } from './useTableLabelMappings';

// ── Debounced filter input ────────────────────────────────────────────────────

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 100,
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => onChange(value), debounce);
    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  return <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
}

// ── Recipe instances — stable strings, computed once ──────────────────────────

const tableClasses = tableRecipe({ size: 'sm', striped: true, stickyHeader: true });
const filterClasses = input({ size: 'sm' });
const paginationClasses = button({ size: 'xs', variant: 'ghost' });

// ── Sort icon helper ──────────────────────────────────────────────────────────

function SortIcon({ sorted }: { sorted: 'asc' | 'desc' | false }) {
  return (
    <span className={tableClasses.sortIcon} data-sort={String(sorted)}>
      {sorted === 'asc' && <ArrowUpIcon className="icon icon-sm" />}
      {sorted === 'desc' && <ArrowDownIcon className="icon icon-sm" />}
      {!sorted && <ChevronsUpDownIcon className="icon icon-sm" />}
    </span>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

/** Keys of all filterable/sortable columns — consumed by useOrdersFilter. */
export type ColumnKey =
  | 'displayIndex'
  | 'id'
  | 'mode'
  | 'drinkType'
  | 'drinkSubtype'
  | 'volume'
  | 'containerType'
  | 'defaultTempConsume'
  | 'actions';

/** Per-column filter state map — consumed by useOrdersFilter. */
export interface ColumnSearchState {
  [key: string]: string;
}

export interface OrdersTableProps {
  orders: OrderReadableWithIndex[];
  emptyMessage?: string;
  onClickEdit: (orderId: string) => void;
  onClickDelete: (orderId: string) => void;
  onSelectionChange?: (selectedOrders: OrderReadableWithIndex[]) => void;
  selectedOrders?: OrderReadableWithIndex[];
}

// ── Component ─────────────────────────────────────────────────────────────────

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  emptyMessage = 'No orders found',
  onClickEdit,
  onClickDelete,
  onSelectionChange,
  selectedOrders: externalSelectedOrders,
}) => {
  const { currentLanguage } = useAppConfig();
  const { getLabel } = useTableLabelMappings(currentLanguage);
  const { getHeader } = useTableHeaders();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({});

  // Controlled mode: convert external OrderReadableWithIndex[] → RowSelectionState
  const controlledRowSelection = useMemo<RowSelectionState>(() => {
    if (!externalSelectedOrders) return {};
    return Object.fromEntries(externalSelectedOrders.map((o) => [o.id, true]));
  }, [externalSelectedOrders]);

  const effectiveRowSelection = onSelectionChange ? controlledRowSelection : internalRowSelection;

  const handleRowSelectionChange = (updater: Updater<RowSelectionState>) => {
    const next = typeof updater === 'function' ? updater(effectiveRowSelection) : updater;
    if (onSelectionChange) {
      onSelectionChange(orders.filter((o) => next[o.id]));
    } else {
      setInternalRowSelection(next);
    }
  };

  const columns = useMemo(
    () => createOrdersColumns(getLabel, getHeader, { onClickEdit, onClickDelete }),
    [getLabel, getHeader, onClickEdit, onClickDelete],
  );

  const table = useReactTable({
    data: orders,
    columns,
    state: { sorting, columnFilters, rowSelection: effectiveRowSelection },
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: handleRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 50 } },
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
      {/* ── Table ────────────────────────────────────────────────────────────── */}
      <div className={tableClasses.root}>
        <table className={tableClasses.table} id="_____TABLE_____">
          <caption className={tableClasses.caption}>Orders</caption>

          {/* ── Header ───────────────────────────────────────────────────── */}
          <thead className={tableClasses.thead}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className={tableClasses.headerRow}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const canFilter = header.column.getCanFilter();
                  return (
                    <th
                      key={header.id}
                      className={tableClasses.th}
                      data-sortable={canSort ? 'true' : undefined}
                      style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-1)',
                          cursor: canSort ? 'pointer' : 'default',
                        }}
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && <SortIcon sorted={header.column.getIsSorted()} />}
                      </div>

                      {canFilter && (
                        <DebouncedInput
                          className={filterClasses}
                          value={(header.column.getFilterValue() as string) ?? ''}
                          onChange={(value) => header.column.setFilterValue(value)}
                          placeholder="Filter…"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          style={{ marginTop: 'var(--spacing-1)', width: '100%' }}
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          {/* ── Body ─────────────────────────────────────────────────────── */}
          <tbody className={tableClasses.tbody}>
            {table.getRowModel().rows.length === 0 ? (
              <tr className={tableClasses.tr}>
                <td colSpan={table.getAllColumns().length} className={tableClasses.emptyState}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={tableClasses.tr}
                  data-selected={row.getIsSelected() ? 'true' : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={tableClasses.td}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ───────────────────────────────────────────────────────── */}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
          <button
            className={paginationClasses}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="First page"
          >
            <DoubleArrowLeftIcon className="icon icon-sm" />
          </button>
          <button
            className={paginationClasses}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="icon icon-sm" />
          </button>

          <span style={{ paddingInline: 'var(--spacing-2)' }}>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>

          <button
            className={paginationClasses}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            <ChevronRightIcon className="icon icon-sm" />
          </button>
          <button
            className={paginationClasses}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Last page"
          >
            <DoubleArrowRightIcon className="icon icon-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};
