import { useMemo } from 'react';

import { useGetSlotConfigurations } from 'queries/slot-configurations';

import type { SlotItemConfig } from 'utils/slot-config.utils';
import { convertSlotConfigsToOrderConfig } from 'utils/slot-config.utils';
import { SlotType } from 'types/slots.types';

/**
 * Hook to get order items configuration from slot configurations API
 * Falls back to hardcoded config if API fails or data is not available
 */
export const useSlotItemsConfig = (): SlotItemConfig[] => {
  const { data: slotConfigs, isLoading, error } = useGetSlotConfigurations();

  const orderItemsConfig = useMemo(() => {
    // If loading or error, use fallback config
    if (isLoading || error || !slotConfigs || slotConfigs.length === 0) {
      log('>> CONFIG_1:', 'red');
      console.warn('Using fallback order items config:', {
        isLoading,
        error,
        slotConfigsLength: slotConfigs?.length,
      });
      // Return fallback config: slots 1-9, special slot 10
      return [
        { slotType: SlotType.A, slotNumber: 1 },
        { slotType: SlotType.B, slotNumber: 2 },
        { slotType: SlotType.B, slotNumber: 3 },
        { slotType: SlotType.B, slotNumber: 4 },
        { slotType: SlotType.B, slotNumber: 5 },
        { slotType: SlotType.B, slotNumber: 6 },
        { slotType: SlotType.B, slotNumber: 7 },
        { slotType: SlotType.B, slotNumber: 8 },
        { slotType: SlotType.B, slotNumber: 9 },
        { slotType: SlotType.C, slotNumber: 10 },
      ];
    }

    // Convert slot configurations to order items config
    try {
      const config = convertSlotConfigsToOrderConfig(slotConfigs);
      // console.log('Loaded order items config from API:', config);

      // log('>> CONFIG_2:', 'red');

      return config;
    } catch (error) {
      console.error('Error converting slot configs to order config:', error);
      log('>> CONFIG_3:', 'red');
      return [
        { slotType: SlotType.A, slotNumber: 1 },
        { slotType: SlotType.B, slotNumber: 2 },
        { slotType: SlotType.B, slotNumber: 3 },
        { slotType: SlotType.B, slotNumber: 4 },
        { slotType: SlotType.B, slotNumber: 5 },
        { slotType: SlotType.B, slotNumber: 6 },
        { slotType: SlotType.B, slotNumber: 7 },
        { slotType: SlotType.B, slotNumber: 8 },
        { slotType: SlotType.B, slotNumber: 9 },
        { slotType: SlotType.C, slotNumber: 10 },
      ];
    }
  }, [slotConfigs, isLoading, error]);

  // log('>> CONFIG_4:', 'red', slotConfigs);

  return orderItemsConfig;
};
