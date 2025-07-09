import React from 'react';
import { Button } from '@radix-ui/themes';
import * as Dialog from '@radix-ui/react-dialog';
import { styles } from './ListDrawer.styles';
import { OrdersTable } from 'components/OrdersTable';

interface ListDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  orders: any[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  totalCount: number;
}

export const ListDrawer: React.FC<ListDrawerProps> = ({
  isOpen,
  onOpenChange,
  orders,
  searchTerm,
  onSearchChange,
  totalCount,
}) => {
  return (
    <div css={styles}>
      <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
        {/* Removed Portal - content renders in place */}
        <Dialog.Overlay className="drawer-overlay" />
        <Dialog.Content className="drawer-content">
          <div
            className="drawer-handle-container"
            onClick={() => onOpenChange(false)}
            role="button"
            aria-label="Close drawer"
          >
            <div className="drawer-handle" />
          </div>

          <div className="drawer-header">
            <h2>Registro de entradas</h2>
            <p>Historial de órdenes registradas</p>
          </div>

          <div className="drawer-body">
            <OrdersTable
              orders={orders}
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              totalCount={totalCount}
              emptyMessage="No orders found"
              emptySubMessage="Try adjusting your search term or add new orders"
            />
          </div>

          <div className="drawer-footer">
            <Dialog.Close asChild>
              <Button variant="soft">Cerrar</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};
