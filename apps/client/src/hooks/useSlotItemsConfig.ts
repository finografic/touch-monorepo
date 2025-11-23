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

  const orderItemsConfig = useMemo((): SlotItemConfig[] => {
    if (isLoading || error || !slotConfigs || slotConfigs.length === 0) {
      return [...DEFAULT_SLOTS_CONFIG];
    }

    try {
      const config = convertSlotConfigsToOrderConfig(slotConfigs);

      return config;
    } catch (error) {
      console.error('Error converting slot configs to order config:', error);

      return [...DEFAULT_SLOTS_CONFIG];
    }
  }, [slotConfigs, isLoading, error]);

  return orderItemsConfig;
};
