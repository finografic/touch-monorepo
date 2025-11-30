import { useMemo } from 'react';

import { useGetSlotConfigurations } from 'queries/slot-configurations';

import { DEFAULT_SLOTS_CONFIG } from 'config/app/slots.config';
import type { SlotItem } from 'types/slot-config.types';

/**
 * Hook to get order items configuration from slot configurations API
 * Falls back to hardcoded config if API fails or data is not available
 */
export const useSlotItemsConfig = (): SlotItem[] => {
  const { data: slotConfigs, isLoading, error } = useGetSlotConfigurations();

  const orderItemsConfig = useMemo((): SlotItem[] => {
    if (isLoading || error || !slotConfigs || slotConfigs.length === 0) {
      return [...DEFAULT_SLOTS_CONFIG];
    }

    try {
      // const config = convertSlotConfigsToOrderConfig(slotConfigs);
      // return config;

      return slotConfigs
        .sort((a, b) => a.slotNumber - b.slotNumber)
        .filter((config) => config.isActive)
        .map((config) => ({
          slotType: config.slotType,
          slotNumber: config.slotNumber,
        }));
    } catch (error) {
      console.error('Error converting slot configs to order config:', error);

      return [...DEFAULT_SLOTS_CONFIG];
    }
  }, [slotConfigs, isLoading, error]);

  return orderItemsConfig;
};
