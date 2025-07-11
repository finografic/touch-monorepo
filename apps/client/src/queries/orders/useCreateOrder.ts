import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';
import { transformAxiosError } from 'api/api.utils';
import { ORDERS_READABLE_QUERY_KEYS } from 'queries/orders';

/**
 * Hook to create a new order
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderData,
      temperatureProfiles = [],
    }: {
      orderData: {
        mode: number;
        drinkTypeId: string;
        drinkSubtypeId?: string;
        volumeId: string;
        containerTypeId: string;
        defaultTempConsume: number;
        defaultTempFreeze: number;
      };
      temperatureProfiles?: Array<{
        temperature: number;
        timeA: number;
        timeB: number;
        timeC: number;
        coolingProfileId?: string;
      }>;
    }): Promise<any> => {
      try {
        // Step 1: Create the order
        console.log('Creating new order with:', orderData);
        const orderResponse = await api.post('/orders', orderData);
        const newOrder = orderResponse.data;

        console.log('Created order:', newOrder);

        // Step 2: Create temperature profiles if provided
        if (temperatureProfiles.length > 0) {
          const profilePromises = temperatureProfiles.map(async (profile) => {
            console.log('Creating temperature profile for new order:', newOrder.id, profile);
            return await api.post('/temperature-profiles', {
              orderId: newOrder.id,
              coolingProfileId: profile.coolingProfileId || 'default', // Fallback to default
              temperature: profile.temperature,
              timeA: profile.timeA,
              timeB: profile.timeB,
              timeC: profile.timeC,
            });
          });

          await Promise.all(profilePromises);
        }

        return newOrder;
      } catch (error) {
        console.error('Error creating order:', error);
        throw transformAxiosError(error);
      }
    },
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ORDERS_READABLE_QUERY_KEYS.lists() });
    },
  });
};
