import { useCallback } from 'react';

import { clearSessionTimer, isSessionTimerExpired } from 'utils/sessionTimer.utils';
import { STORAGE_KEYS } from 'config/app';

interface ConfigData {
  filters: Record<string, unknown>;
  temperatures: Record<string, number>;
  durations: Record<string, number>;
  selectedOrders?: number[];
}

export const useConfigStorage = () => {
  const saveConfig = useCallback((config: ConfigData) => {
    sessionStorage.setItem(STORAGE_KEYS.LAST_CONFIG, JSON.stringify(config));

    if (isSessionTimerExpired()) {
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
