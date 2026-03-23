import { Checkbox } from '@finografic/design-system/forms';
import { EditIcon, TrashIcon } from '@finografic/icons';

import type { ColumnDef } from '@tanstack/react-table';
import { button } from 'styled-system/recipes';

import type { OrderReadableWithIndex } from '../hooks/useOrdersFilter';

// ── Recipe instances — stable strings, computed once ──────────────────────────

const editClasses = button({ size: 'xs', variant: 'ghost' });
const deleteClasses = button({ size: 'xs', variant: 'ghost', palette: 'danger' });

// ── Types ─────────────────────────────────────────────────────────────────────

interface GetLabel {
  mode: (v: string | null | undefined) => string;
  drinkType: (v: string | null | undefined) => string;
  drinkSubtype: (v: string | null | undefined) => string;
  volume: (v: string | null | undefined) => string;
  containerType: (v: string | null | undefined) => string;
}

interface ColumnActions {
  onClickEdit: (id: string) => void;
  onClickDelete: (id: string) => void;
}

// ── Column factory ────────────────────────────────────────────────────────────

export function createOrdersColumns(
  getLabel: GetLabel,
  getHeader: (field: string) => string,
  actions: ColumnActions,
): ColumnDef<OrderReadableWithIndex>[] {
  return [
    // ── Row selection ──────────────────────────────────────────────────────
    {
      id: 'select',
      header: ({ table }) => (
        <CheckboxField
          checked={table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
            ? 'indeterminate'
            : false}
          onCheckedChange={({ checked }) => table.toggleAllPageRowsSelected(!!checked)}
          size="sm"
        />
      ),
      cell: ({ row }) => (
        <CheckboxField
          checked={row.getIsSelected()}
          onCheckedChange={({ checked }) => row.toggleSelected(!!checked)}
          size="sm"
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
      size: 40,
    },

    // ── Data columns ───────────────────────────────────────────────────────
    {
      accessorKey: 'displayIndex',
      header: () => getHeader('displayIndex'),
    },
    {
      accessorKey: 'mode',
      header: () => getHeader('mode'),
      cell: ({ getValue }) => getLabel.mode(getValue() as string | null | undefined),
    },
    {
      accessorKey: 'drinkType',
      header: () => getHeader('drinkType'),
      cell: ({ getValue }) => getLabel.drinkType(getValue() as string | null | undefined),
    },
    {
      accessorKey: 'drinkSubtype',
      header: () => getHeader('drinkSubtype'),
      cell: ({ getValue }) => getLabel.drinkSubtype(getValue() as string | null | undefined),
    },
    {
      accessorKey: 'volume',
      header: () => getHeader('volume'),
      cell: ({ getValue }) => getLabel.volume(getValue() as string | null | undefined),
    },
    {
      accessorKey: 'containerType',
      header: () => getHeader('containerType'),
      cell: ({ getValue }) => getLabel.containerType(getValue() as string | null | undefined),
    },
    {
      accessorKey: 'defaultTempConsume',
      header: () => getHeader('defaultTempConsume'),
      cell: ({ getValue }) => {
        const v = getValue() as number | null | undefined;
        return v != null ? `${v}°C` : '-';
      },
      enableColumnFilter: false,
    },

    // ── Actions column ─────────────────────────────────────────────────────
    {
      id: 'actions',
      header: () => getHeader('actions'),
      cell: ({ row }) => (
        <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
          <button
            className={editClasses}
            onClick={() => actions.onClickEdit(row.original.id)}
            aria-label="Edit order"
          >
            <EditIcon className="icon icon-md" />
          </button>
          <button
            className={deleteClasses}
            onClick={() => actions.onClickDelete(row.original.id)}
            aria-label="Delete order"
          >
            <TrashIcon className="icon icon-md" />
          </button>
        </div>
      ),
      enableSorting: false,
      enableColumnFilter: false,
      size: 80,
    },
  ];
}
