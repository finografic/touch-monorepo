import { useMemo } from 'react';
import { useGetSlotConfigurations } from 'queries/slot-configurations';
import type { OrderItemConfig } from 'utils/slot-config.utils';
import { convertSlotConfigsToOrderConfig } from 'utils/slot-config.utils';
import { SlotType } from 'types/orders.types';

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
        { slotType: SlotType.A, number: 1 },
        { slotType: SlotType.B, number: 2 },
        { slotType: SlotType.B, number: 3 },
        { slotType: SlotType.B, number: 4 },
        { slotType: SlotType.B, number: 5 },
        { slotType: SlotType.B, number: 6 },
        { slotType: SlotType.B, number: 7 },
        { slotType: SlotType.B, number: 8 },
        { slotType: SlotType.B, number: 9 },
        { slotType: SlotType.C, number: 10 },
      ];
    }

    // Convert slot configurations to order items config
    try {
      const config = convertSlotConfigsToOrderConfig(slotConfigs);
      // console.log('Loaded order items config from API:', config);
      return config;
    } catch (error) {
      console.error('Error converting slot configs to order config:', error);
      return [
        { slotType: SlotType.A, number: 1 },
        { slotType: SlotType.B, number: 2 },
        { slotType: SlotType.B, number: 3 },
        { slotType: SlotType.B, number: 4 },
        { slotType: SlotType.B, number: 5 },
        { slotType: SlotType.B, number: 6 },
        { slotType: SlotType.B, number: 7 },
        { slotType: SlotType.B, number: 8 },
        { slotType: SlotType.B, number: 9 },
        { slotType: SlotType.C, number: 10 },
      ];
    }
  }, [slotConfigs, isLoading, error]);

  return orderItemsConfig;
};
