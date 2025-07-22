import { useMemo } from 'react';
import { useGetSlotConfigurations } from 'queries/slot-configurations';
import type { OrderItemConfig } from 'utils/slot-config.utils';
import { convertSlotConfigsToOrderConfig } from 'utils/slot-config.utils';
import { ItemType } from 'types/orders.types';

/**
 * Hook to get order items configuration from slot configurations API
 * Falls back to hardcoded config if API fails or data is not available
 */
export const useOrderItemsConfig = (): OrderItemConfig[] => {
  const { data: slotConfigs, isLoading, error } = useGetSlotConfigurations();

  const orderItemsConfig = useMemo(() => {
    // If loading or error, use fallback config
    if (isLoading || error || !slotConfigs || slotConfigs.length === 0) {
      console.warn('Using fallback order items config:', {
        isLoading,
        error,
        slotConfigsLength: slotConfigs?.length,
      });
      // Return fallback config: slots 1-9, special slot 10
      return [
        { itemType: ItemType.A, number: 1 },
        { itemType: ItemType.B, number: 2 },
        { itemType: ItemType.B, number: 3 },
        { itemType: ItemType.B, number: 4 },
        { itemType: ItemType.B, number: 5 },
        { itemType: ItemType.B, number: 6 },
        { itemType: ItemType.B, number: 7 },
        { itemType: ItemType.B, number: 8 },
        { itemType: ItemType.B, number: 9 },
        { itemType: ItemType.C, number: 10 },
      ];
    }

    // Convert slot configurations to order items config
    try {
      const config = convertSlotConfigsToOrderConfig(slotConfigs);
      console.log('Loaded order items config from API:', config);
      return config;
    } catch (error) {
      console.error('Error converting slot configs to order config:', error);
      return [
        { itemType: ItemType.A, number: 1 },
        { itemType: ItemType.B, number: 2 },
        { itemType: ItemType.B, number: 3 },
        { itemType: ItemType.B, number: 4 },
        { itemType: ItemType.B, number: 5 },
        { itemType: ItemType.B, number: 6 },
        { itemType: ItemType.B, number: 7 },
        { itemType: ItemType.B, number: 8 },
        { itemType: ItemType.B, number: 9 },
        { itemType: ItemType.C, number: 10 },
      ];
    }
  }, [slotConfigs, isLoading, error]);

  return orderItemsConfig;
};
