import { useCallback, useMemo } from 'react';

import type { OrderFilters } from 'types/filters.types';
import { useTimers } from 'providers/TimersProvider/TimersContext';
import type { RecallConfig } from 'providers/TimersProvider/timer.types';

interface ConfigData {
  filters: OrderFilters;
  temperatures: Record<string, number>;
  durations: Record<string, number>;
  selectedOrders?: number[];
}

export const useRecallConfig = () => {
  const { recall, setRecallConfig, getRecallConfig, clearRecallConfig } = useTimers();

  const saveRecallConfig = useCallback(
    (config: ConfigData, forceResetTimer = false) => {
      // Convert ConfigData to RecallConfig (they have the same structure)
      const recallConfig: RecallConfig = {
        filters: config.filters,
        temperatures: config.temperatures,
        durations: config.durations,
        selectedOrders: config.selectedOrders,
      };

      // Also save config to TimersContext
      setRecallConfig(recallConfig, forceResetTimer);
    },
    [setRecallConfig],
  );

  const loadRecallConfig = useCallback((): ConfigData | null => {
    const recallConfig = getRecallConfig();

    if (!recallConfig) {
      return null;
    }

    return {
      filters: recallConfig.filters,
      temperatures: recallConfig.temperatures,
      durations: recallConfig.durations,
      selectedOrders: recallConfig.selectedOrders,
    };
  }, [getRecallConfig]);

  // Utility methods (moved from TimersContext)
  // These are computed on each render to ensure they're current
  const isRecallExpired = useMemo((): boolean => {
    const now = Date.now();
    return recall.expiresAt === null || now >= recall.expiresAt;
  }, [recall.expiresAt]);

  const getRecallRemainingTime = useCallback((): number => {
    if (recall.expiresAt === null) {
      return 0;
    }
    const now = Date.now();
    const remaining = recall.expiresAt - now;
    return Math.max(0, remaining);
  }, [recall.expiresAt]);

  return {
    saveRecallConfig,
    loadRecallConfig,
    clearRecallConfig,
    isRecallExpired,
    getRecallRemainingTime,
    recallConfig: recall.config,
  };
};
