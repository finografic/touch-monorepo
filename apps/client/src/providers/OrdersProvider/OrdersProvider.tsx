import { useEffect } from 'react';
import type { OrdersProviderProps } from './OrdersContext.types';
import { DISPLAY_NAME, OrdersContext as Orders, useOrders } from './OrdersContext';

// Component that fetches orders readable data once when the provider initializes
const OrdersDataInitializer = () => {
  const { ordersReadable, fetchOrdersReadable } = useOrders();

  useEffect(() => {
    // Fetch orders readable data once when component mounts if not already loaded
    if (ordersReadable.length === 0) {
      fetchOrdersReadable();
    }
  }, [ordersReadable.length, fetchOrdersReadable]);

  return null; // This component doesn't render anything
};

export const OrdersProvider = ({ initialValue, children }: OrdersProviderProps) => {
  return (
    <Orders.Provider initialValue={initialValue}>
      <OrdersDataInitializer />
      {children}
    </Orders.Provider>
  );
};

OrdersProvider.displayName = `${DISPLAY_NAME}Provider`;
