import { useEffect, useRef } from 'react';

import { useOrders } from './OrdersContext';

// Component that fetches orders readable data once when the provider initializes
export const OrdersDataInitializer = () => {
  const { ordersReadable, fetchOrdersReadable } = useOrders();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // 🚀 PERFORMANCE: Only fetch once, even if ordersReadable changes
    if (!hasFetchedRef.current && ordersReadable.length === 0) {
      hasFetchedRef.current = true;
      fetchOrdersReadable();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return null; // This component doesn't render anything
};
