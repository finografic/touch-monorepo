import React from 'react';
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
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  return (
    <div css={styles} className={`list-drawer ${isOpen ? 'open' : 'closed'}`}>
      <div className="drawer-overlay" onClick={handleOverlayClick} />
      <div className="drawer-content">
        <div className="header-bar">
          <h2>Registro de entradas</h2>
          <button className="toggle-button" onClick={() => onOpenChange(!isOpen)}>
            {isOpen ? '▼' : '▲'}
          </button>
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
      </div>
    </div>
  );
};
