import { useCallback } from 'react';

import type { OrderFilters } from 'types/filters.types';
import { useTimers } from 'providers/TimersProvider/TimersContext';
import type { RecallConfig } from 'providers/TimersProvider/timer.types';

interface ConfigData {
  // filters: Record<string, unknown>;
  filters: OrderFilters;
  temperatures: Record<string, number>;
  durations: Record<string, number>;
  selectedOrders?: number[];
}

export const useRecallConfig = () => {
  const { setRecallConfig, getRecallConfig, clearRecallConfig } = useTimers();

  const saveConfig = useCallback(
    (config: ConfigData, forceResetTimer = false) => {
      // Convert ConfigData to RecallConfig (they have the same structure)
      const recallConfig: RecallConfig = {
        filters: config.filters,
        temperatures: config.temperatures,
        durations: config.durations,
        selectedOrders: config.selectedOrders,
      };

      // Use TimersContext to save config
      setRecallConfig(recallConfig, forceResetTimer);
    },
    [setRecallConfig],
  );

  const loadConfig = useCallback((): ConfigData | null => {
    const recallConfig = getRecallConfig();

    if (!recallConfig) {
      return null;
    }

    // Convert RecallConfig back to ConfigData (they have the same structure)
    return {
      filters: recallConfig.filters,
      temperatures: recallConfig.temperatures,
      durations: recallConfig.durations,
      selectedOrders: recallConfig.selectedOrders,
    };
  }, [getRecallConfig]);

  const clearConfig = useCallback(() => {
    clearRecallConfig();
  }, [clearRecallConfig]);

  return {
    saveConfig,
    loadConfig,
    clearConfig,
  };
};
