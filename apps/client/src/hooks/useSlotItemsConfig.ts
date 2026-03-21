import { useMemo } from 'react';
import type { ErrorResponse } from '@workspace/core/api';

import { useGetSlotConfigurations } from 'queries/slot-configurations';

import type { SlotConfiguration, SlotItem } from 'types/slot-config.types';
import { DEFAULT_SLOTS_CONFIG, resolveMainPageSlotType } from 'config/app/slots.config';

interface SlotItemsConfigReturn {
  items: SlotItem[];
  itemsBySlot: Map<number, SlotItem>;
  allSlots: SlotConfiguration[];
  isLoading: boolean;
  isError: boolean;
  error: ErrorResponse | null;
  isSuccess: boolean;
  refetch: () => void;
}

/**
 * Hook to get order items configuration from slot configurations API
 * Falls back to hardcoded config if API fails or data is not available
 */
export const useSlotItemsConfig = (options?: { onlyActive?: boolean }): SlotItemsConfigReturn => {
  const query = useGetSlotConfigurations();

  const allSlots = query.data ?? (DEFAULT_SLOTS_CONFIG as SlotConfiguration[]);

  const items = useMemo((): SlotItem[] => {
    let list = allSlots
      .slice()
      .sort((a, b) => a.slotNumber - b.slotNumber)
      .map((cfg) => ({
        slotNumber: cfg.slotNumber,
        slotType: resolveMainPageSlotType(cfg.slotNumber, cfg.slotType),
        isActive: cfg.isActive,
      }));

    if (options?.onlyActive) {
      list = list.filter((item) => item.isActive);
    }

    return list;
  }, [allSlots, options?.onlyActive]);

  const itemsBySlot = useMemo(() => {
    const map = new Map<number, SlotItem>();
    for (const item of items) {
      map.set(item.slotNumber, item);
    }
    return map;
  }, [items]);

  return {
    items,
    itemsBySlot,
    allSlots, // raw API response
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
  };
};
