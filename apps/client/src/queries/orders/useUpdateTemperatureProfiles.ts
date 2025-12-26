import { useMutation, useQueryClient } from '@tanstack/react-query';

import { EndpointsOrders, type TemperatureProfileInput } from 'api/endpoints';
import { GET_ORDER_READABLE_QUERYKEY } from 'queries/orders';

/**
 * Hook to update temperature profiles for an order
 * Replaces all existing profiles with new ones (full replace strategy)
 */
export const useUpdateTemperatureProfiles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, profiles }: { orderId: string; profiles: TemperatureProfileInput[] }) =>
      EndpointsOrders.updateTemperatureProfiles(orderId, profiles),
    onSuccess: (_, { orderId }) => {
      // Invalidate temperature profiles for this order
      queryClient.invalidateQueries({
        queryKey: ['temperature-profiles', 'by-order', orderId],
      });
      // Also invalidate the order readable data since it includes temperature profiles
      queryClient.invalidateQueries({ queryKey: [...GET_ORDER_READABLE_QUERYKEY, orderId] });
    },
  });
};
