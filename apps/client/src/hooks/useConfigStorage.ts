import { useCallback } from 'react';

import { clearSessionTimer, isSessionTimerExpired } from 'utils/sessionTimer.utils';
import { STORAGE_KEYS } from 'config/app';
import type { OrderFilters } from 'types/filters.types';

interface ConfigData {
  // filters: Record<string, unknown>;
  filters: OrderFilters;
  temperatures: Record<string, number>;
  durations: Record<string, number>;
  selectedOrders?: number[];
}

export const useConfigStorage = () => {
  const saveConfig = useCallback((config: ConfigData, forceResetTimer = false) => {
    // Always overwrite the config (full replacement)
    sessionStorage.setItem(STORAGE_KEYS.LAST_CONFIG, JSON.stringify(config));

    // Reset timer if forced (Program Product flow) or if expired (Program Time flow)
    if (forceResetTimer || isSessionTimerExpired()) {
      sessionStorage.setItem(STORAGE_KEYS.CONFIG_TIMESTAMP, Date.now().toString());
    }
  }, []);

  const loadConfig = useCallback((): ConfigData | null => {
    const config = sessionStorage.getItem(STORAGE_KEYS.LAST_CONFIG);

    if (!config) {
      return null;
    }

    if (isSessionTimerExpired()) {
      sessionStorage.removeItem(STORAGE_KEYS.LAST_CONFIG);
      clearSessionTimer();
      return null;
    }

    try {
      return JSON.parse(config);
    } catch (e) {
      console.error('Failed to parse stored configuration:', e);
      return null;
    }
  }, []);

  const clearConfig = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEYS.LAST_CONFIG);
    clearSessionTimer();
  }, []);

  return {
    saveConfig,
    loadConfig,
    clearConfig,
  };
};
