import { useEffect } from 'react';

import { useOrders } from './OrdersContext';

// Component that fetches orders readable data once when the provider initializes
export const OrdersDataInitializer = () => {
  const { ordersReadable, fetchOrdersReadable } = useOrders();

  useEffect(() => {
    // Fetch orders readable data once when component mounts if not already loaded
    if (ordersReadable.length === 0) {
      fetchOrdersReadable();
    }
  }, [ordersReadable.length, fetchOrdersReadable]);

  return null; // This component doesn't render anything
};
