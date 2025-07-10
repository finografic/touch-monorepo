import React, { useState } from 'react';
import { styles } from './ListDrawer.styles';
import { OrdersTable } from 'components/OrdersTable';
import { SearchBar } from 'components/SearchBar';
import { DrawerBar } from './DrawerBar';

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  return (
    <div css={styles} className={`list-drawer ${isDrawerOpen ? 'open' : 'closed'}`}>
      <div className="drawer-overlay" onClick={handleOverlayClick} />
      <div className="drawer-content">
        <div className="drawer-body">
          <DrawerBar isActionActive={isDrawerOpen} onClickAction={() => setIsDrawerOpen(!isDrawerOpen)}>
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              status={isDrawerOpen ? 'active' : 'inactive'}
              isActive={isDrawerOpen}
            />
          </DrawerBar>
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
