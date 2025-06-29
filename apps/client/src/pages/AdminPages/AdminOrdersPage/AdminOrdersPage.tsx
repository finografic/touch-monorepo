import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Badge,
  Button,
  Callout,
  Dialog,
  Flex,
  IconButton,
  Select,
  Spinner,
  Table,
  Text,
  TextField,
} from '@radix-ui/themes';
import {
  type ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AdminContentLayout, AdminSection } from '../shared';
import {
  type OrderDev,
  type OrderDevUpdate,
  useCreateOrderDev,
  useDeleteOrderDev,
  useGetOrdersDev,
  useUpdateOrderDev,
} from 'api/hooks/useOrdersDev';
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons';

const columnHelper = createColumnHelper<OrderDev>();

export const AdminOrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const [editingCells, setEditingCells] = useState<Record<string, string>>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; order: OrderDev | null }>({
    isOpen: false,
    order: null,
  });

  // API hooks
  const { data: orders = [], isLoading, error } = useGetOrdersDev();
  const updateOrderMutation = useUpdateOrderDev();
  const deleteOrderMutation = useDeleteOrderDev();
  const createOrderMutation = useCreateOrderDev();

  // Handle cell edit
  const handleCellEdit = (rowId: string, columnId: string, value: string) => {
    const cellKey = `${rowId}-${columnId}`;
    setEditingCells((prev) => ({ ...prev, [cellKey]: value }));
  };

  // Handle cell commit (save)
  const handleCellCommit = async (rowId: string, columnId: string) => {
    const cellKey = `${rowId}-${columnId}`;
    const newValue = editingCells[cellKey];

    if (newValue !== undefined) {
      try {
        const updates: OrderDevUpdate = {};

        // Handle different field types
        if (columnId === 'defaultTempConsume' || columnId === 'defaultTempFreeze') {
          const numValue = Number.parseInt(newValue);
          if (!Number.isNaN(numValue)) {
            updates[columnId] = numValue;
          }
        } else if (columnId === 'isActive') {
          updates[columnId] = newValue === 'true';
        } else {
          // String fields
          updates[columnId as keyof OrderDevUpdate] = newValue as any;
        }

        await updateOrderMutation.mutateAsync({ id: rowId, updates });
        setMessage({ type: 'success', text: 'Order updated successfully!' });

        // Remove from editing state
        setEditingCells((prev) => {
          const { [cellKey]: _, ...rest } = prev;
          return rest;
        });
      } catch (error) {
        setMessage({
          type: 'error',
          text: `Failed to update order: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    }
  };

  // Define table columns
  const columns = useMemo(
    () =>
      [
        columnHelper.accessor('drinkTypeName', {
          header: 'Drink Type',
          cell: ({ row, getValue }) => {
            const cellKey = `${row.original.id}-drinkTypeName`;
            const isEditing = cellKey in editingCells;
            const value = isEditing ? editingCells[cellKey] : getValue();

            return isEditing ? (
              <TextField.Root
                value={value}
                onChange={(e) => handleCellEdit(row.original.id, 'drinkTypeName', e.target.value)}
                onBlur={() => handleCellCommit(row.original.id, 'drinkTypeName')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCellCommit(row.original.id, 'drinkTypeName');
                  }
                }}
                size="1"
                autoFocus
              />
            ) : (
              <Text
                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                onClick={() => setEditingCells((prev) => ({ ...prev, [cellKey]: getValue() }))}
              >
                {value}
              </Text>
            );
          },
        }),
        columnHelper.accessor('drinkSubtypeName', {
          header: 'Subtype',
          cell: ({ row, getValue }) => {
            const cellKey = `${row.original.id}-drinkSubtypeName`;
            const isEditing = cellKey in editingCells;
            const value = isEditing ? editingCells[cellKey] : getValue() || '';

            return isEditing ? (
              <TextField.Root
                value={value}
                onChange={(e) => handleCellEdit(row.original.id, 'drinkSubtypeName', e.target.value)}
                onBlur={() => handleCellCommit(row.original.id, 'drinkSubtypeName')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCellCommit(row.original.id, 'drinkSubtypeName');
                  }
                }}
                size="1"
                autoFocus
              />
            ) : (
              <Text
                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                onClick={() => setEditingCells((prev) => ({ ...prev, [cellKey]: getValue() || '' }))}
              >
                {value || '-'}
              </Text>
            );
          },
        }),
        columnHelper.accessor('volumeName', {
          header: 'Volume',
          cell: ({ row, getValue }) => {
            const cellKey = `${row.original.id}-volumeName`;
            const isEditing = cellKey in editingCells;
            const value = isEditing ? editingCells[cellKey] : getValue();

            return isEditing ? (
              <TextField.Root
                value={value}
                onChange={(e) => handleCellEdit(row.original.id, 'volumeName', e.target.value)}
                onBlur={() => handleCellCommit(row.original.id, 'volumeName')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCellCommit(row.original.id, 'volumeName');
                  }
                }}
                size="1"
                autoFocus
              />
            ) : (
              <Text
                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                onClick={() => setEditingCells((prev) => ({ ...prev, [cellKey]: getValue() }))}
              >
                {value}
              </Text>
            );
          },
        }),
        columnHelper.accessor('containerTypeName', {
          header: 'Container',
          cell: ({ row, getValue }) => {
            const cellKey = `${row.original.id}-containerTypeName`;
            const isEditing = cellKey in editingCells;
            const value = isEditing ? editingCells[cellKey] : getValue();

            return isEditing ? (
              <TextField.Root
                value={value}
                onChange={(e) => handleCellEdit(row.original.id, 'containerTypeName', e.target.value)}
                onBlur={() => handleCellCommit(row.original.id, 'containerTypeName')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCellCommit(row.original.id, 'containerTypeName');
                  }
                }}
                size="1"
                autoFocus
              />
            ) : (
              <Text
                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                onClick={() => setEditingCells((prev) => ({ ...prev, [cellKey]: getValue() }))}
              >
                {value}
              </Text>
            );
          },
        }),
        columnHelper.accessor('defaultTempConsume', {
          header: 'Temp Consume (°C)',
          cell: ({ row, getValue }) => {
            const cellKey = `${row.original.id}-defaultTempConsume`;
            const isEditing = cellKey in editingCells;
            const value = isEditing ? editingCells[cellKey] : getValue().toString();

            return isEditing ? (
              <TextField.Root
                type="number"
                value={value}
                onChange={(e) => handleCellEdit(row.original.id, 'defaultTempConsume', e.target.value)}
                onBlur={() => handleCellCommit(row.original.id, 'defaultTempConsume')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCellCommit(row.original.id, 'defaultTempConsume');
                  }
                }}
                size="1"
                autoFocus
              />
            ) : (
              <Text
                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                onClick={() => setEditingCells((prev) => ({ ...prev, [cellKey]: getValue().toString() }))}
              >
                {value}°C
              </Text>
            );
          },
        }),
        columnHelper.accessor('defaultTempFreeze', {
          header: 'Temp Freeze (°C)',
          cell: ({ row, getValue }) => {
            const cellKey = `${row.original.id}-defaultTempFreeze`;
            const isEditing = cellKey in editingCells;
            const value = isEditing ? editingCells[cellKey] : getValue().toString();

            return isEditing ? (
              <TextField.Root
                type="number"
                value={value}
                onChange={(e) => handleCellEdit(row.original.id, 'defaultTempFreeze', e.target.value)}
                onBlur={() => handleCellCommit(row.original.id, 'defaultTempFreeze')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCellCommit(row.original.id, 'defaultTempFreeze');
                  }
                }}
                size="1"
                autoFocus
              />
            ) : (
              <Text
                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                onClick={() => setEditingCells((prev) => ({ ...prev, [cellKey]: getValue().toString() }))}
              >
                {value}°C
              </Text>
            );
          },
        }),
        columnHelper.accessor('isActive', {
          header: 'Status',
          cell: ({ row, getValue }) => {
            const isActive = getValue();
            return <Badge color={isActive ? 'green' : 'red'}>{isActive ? 'Active' : 'Inactive'}</Badge>;
          },
        }),
        columnHelper.display({
          id: 'actions',
          header: 'Actions',
          cell: ({ row }) => (
            <IconButton
              variant="soft"
              color="red"
              size="1"
              onClick={() => setDeleteDialog({ isOpen: true, order: row.original })}
            >
              <TrashIcon />
            </IconButton>
          ),
        }),
      ] as ColumnDef<OrderDev>[],
    [editingCells],
  );

  // React Table instance
  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: 'includesString',
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  // Handle delete
  const handleDelete = async () => {
    const { order } = deleteDialog;
    if (!order) return;

    try {
      await deleteOrderMutation.mutateAsync(order.id);
      setMessage({ type: 'success', text: 'Order deleted successfully!' });
      setDeleteDialog({ isOpen: false, order: null });
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Failed to delete order: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  // Clear message after 5 seconds
  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (isLoading) {
    return (
      <AdminContentLayout
        title="Orders Management"
        subtitle="Development orders for testing"
        isLoading={true}
      >
        <Flex direction="column" gap="4" align="center" justify="center" p="6">
          <Spinner size="3" />
          <Text>Loading orders...</Text>
        </Flex>
      </AdminContentLayout>
    );
  }

  if (error) {
    return (
      <AdminContentLayout
        title="Orders Management"
        subtitle="Development orders for testing"
        error={error.message}
      >
        <AdminSection>
          <Text color="red">Error loading orders: {error.message}</Text>
        </AdminSection>
      </AdminContentLayout>
    );
  }

  return (
    <AdminContentLayout title="Orders Management" subtitle="Development orders for testing">
      <AdminSection>
        {/* Message Display */}
        {message && (
          <Callout.Root color={message.type === 'error' ? 'red' : 'green'} mb="4">
            <Callout.Text>{message.text}</Callout.Text>
          </Callout.Root>
        )}

        {/* Controls */}
        <Flex justify="between" align="center" mb="4">
          <Flex align="center" gap="3">
            <TextField.Root
              placeholder="Search orders..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              size="2"
            />
            <Text size="2" color="gray">
              {table.getFilteredRowModel().rows.length} of {orders.length} orders
            </Text>
          </Flex>

          <Button variant="solid" size="2">
            <PlusIcon /> Add Order
          </Button>
        </Flex>

        {/* Table */}
        <Table.Root>
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.ColumnHeaderCell key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </Table.ColumnHeaderCell>
                ))}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body>
            {table.getRowModel().rows.map((row) => (
              <Table.Row key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        {/* Empty state */}
        {table.getFilteredRowModel().rows.length === 0 && (
          <Flex direction="column" align="center" justify="center" py="8">
            <Text size="3" color="gray">
              No orders found
            </Text>
            <Text size="2" color="gray">
              Try adjusting your search or add a new order
            </Text>
          </Flex>
        )}

        {/* Delete Dialog */}
        <Dialog.Root
          open={deleteDialog.isOpen}
          onOpenChange={(open) => setDeleteDialog({ isOpen: open, order: null })}
        >
          <Dialog.Content maxWidth="450px">
            <Dialog.Title>Delete Order</Dialog.Title>
            <Dialog.Description size="2">
              Are you sure you want to delete this order? This action cannot be undone.
              {deleteDialog.order && (
                <Text as="div" mt="2" weight="bold">
                  {deleteDialog.order.drinkTypeName} - {deleteDialog.order.volumeName}
                </Text>
              )}
            </Dialog.Description>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                variant="solid"
                color="red"
                onClick={handleDelete}
                loading={deleteOrderMutation.isPending}
              >
                Delete
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </AdminSection>
    </AdminContentLayout>
  );
};
