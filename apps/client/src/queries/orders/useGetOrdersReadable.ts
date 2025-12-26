import { useQuery } from '@tanstack/react-query';

import { EndpointsOrders } from 'api/endpoints';
import { GET_ORDERS_READABLE_QUERYKEY } from 'queries/orders';
import type { OrderReadableModel } from 'types/models/order-readable.model';

/**
 * Hook to fetch orders from the orders-readable view
 * This includes all joined data with human-readable names
 */
export const useGetOrdersReadable = () => {
  return useQuery<OrderReadableModel[]>({
    queryKey: GET_ORDERS_READABLE_QUERYKEY,
    queryFn: EndpointsOrders.getAllReadable,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
