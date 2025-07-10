import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';
import { transformAxiosError } from '../api.utils';

// Types for orders-dev based on server schema with both IDs and names for development
export interface OrderDev {
  id: string;
  // Foreign key IDs (for relationships)
  drinkTypeId: string;
  drinkSubtypeId?: string;
  volumeId: string;
  containerTypeId: string;
  temperatureProfileId: string;
  // Human-readable names (for display and translation keys)
  drinkTypeName: string;
  drinkSubtypeName?: string;
  volumeName: string;
  containerTypeName: string;
  temperatureProfileName: string;
  // Other fields
  defaultTempConsume: number;
  defaultTempFreeze: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderDevInput {
  drinkTypeId: string;
  drinkSubtypeId?: string;
  volumeId: string;
  containerTypeId: string;
  defaultTempConsume: number;
  defaultTempFreeze: number;
  temperatureProfileId: string;
}

export interface OrderDevUpdate {
  drinkTypeId?: string;
  drinkSubtypeId?: string;
  volumeId?: string;
  containerTypeId?: string;
  defaultTempConsume?: number;
  defaultTempFreeze?: number;
  temperatureProfileId?: string;
  isActive?: boolean;
}

// Query keys for caching
export const ORDERS_DEV_QUERY_KEYS = {
  all: ['orders'] as const,
  lists: () => [...ORDERS_DEV_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: string) => [...ORDERS_DEV_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...ORDERS_DEV_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ORDERS_DEV_QUERY_KEYS.details(), id] as const,
};

/**
 * Hook to fetch all orders
 */
export const useGetOrdersDev = () => {
  return useQuery({
    queryKey: ORDERS_DEV_QUERY_KEYS.lists(),
    queryFn: async (): Promise<OrderDev[]> => {
      try {
        const response = await api.get('/orders');
        return response.data;
      } catch (error) {
        throw transformAxiosError(error);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single order-dev by ID
 */
export const useGetOrderDev = (id: string) => {
  return useQuery({
    queryKey: ORDERS_DEV_QUERY_KEYS.detail(id),
    queryFn: async (): Promise<OrderDev> => {
      try {
        const response = await api.get(`/orders/${id}`);
        return response.data;
      } catch (error) {
        throw transformAxiosError(error);
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to create a new order-dev
 */
export const useCreateOrderDev = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: OrderDevInput): Promise<OrderDev> => {
      try {
        const response = await api.post('/orders', orderData);
        return response.data;
      } catch (error) {
        throw transformAxiosError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_DEV_QUERY_KEYS.lists() });
    },
  });
};

/**
 * Hook to update an order-dev
 */
export const useUpdateOrderDev = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: OrderDevUpdate }): Promise<OrderDev> => {
      try {
        const response = await api.patch(`/orders/${id}`, updates);
        return response.data;
      } catch (error) {
        throw transformAxiosError(error);
      }
    },
    onSuccess: (updatedOrder) => {
      // Update the specific item in cache
      queryClient.setQueryData<OrderDev[]>(ORDERS_DEV_QUERY_KEYS.lists(), (oldData) => {
        if (!oldData) return [updatedOrder];
        return oldData.map((item) => (item.id === updatedOrder.id ? updatedOrder : item));
      });

      // Also update the detail query if it exists
      queryClient.setQueryData(ORDERS_DEV_QUERY_KEYS.detail(updatedOrder.id), updatedOrder);
    },
  });
};

/**
 * Hook to delete an order-dev
 */
export const useDeleteOrderDev = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      try {
        await api.delete(`/orders/${id}`);
      } catch (error) {
        throw transformAxiosError(error);
      }
    },
    onSuccess: (_, deletedId) => {
      // Remove from list cache
      queryClient.setQueryData<OrderDev[]>(ORDERS_DEV_QUERY_KEYS.lists(), (oldData) => {
        if (!oldData) return [];
        return oldData.filter((item) => item.id !== deletedId);
      });

      // Remove from detail cache
      queryClient.removeQueries({ queryKey: ORDERS_DEV_QUERY_KEYS.detail(deletedId) });
    },
  });
};
