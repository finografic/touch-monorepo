import { transformFetchError } from '@workspace/core/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';
import { GET_ORDERS_QUERYKEY, GET_ORDERS_READABLE_QUERYKEY } from 'queries/orders';

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
        modeId?: string;
      }>;
    }): Promise<any> => {
      try {
        // Step 1: Create the order
        console.log('Creating new order with:', orderData);
        const newOrder = await api.post('/orders', orderData);

        console.log('Created order:', newOrder);

        // Step 2: Create temperature profiles if provided
        if (temperatureProfiles.length > 0 && newOrder && typeof newOrder === 'object' && 'id' in newOrder) {
          const profilePromises = temperatureProfiles.map(async (profile) => {
            console.log('Creating temperature profile for new order:', (newOrder as any).id, profile);
            return await api.post('/temperature-profiles', {
              orderId: (newOrder as any).id,
              modeId: profile.modeId || 'default', // Fallback to default
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
        throw transformFetchError(error);
      }
    },
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: GET_ORDERS_QUERYKEY });
      queryClient.invalidateQueries({ queryKey: GET_ORDERS_READABLE_QUERYKEY });
    },
  });
};
