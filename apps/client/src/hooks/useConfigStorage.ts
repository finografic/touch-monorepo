import { useCallback } from 'react';
import { CONFIG_EXPIRY_TIME_MS, STORAGE_KEYS } from 'config/app';
import { clearSessionTimer, isSessionTimerExpired } from 'utils/sessionTimer.utils';

interface ConfigData {
  filters: Record<string, unknown>;
  temperatures: Record<string, number>;
  durations: Record<string, number>;
  selectedOrders?: number[];
}

export const useConfigStorage = () => {
  const saveConfig = useCallback((config: ConfigData) => {
    // Save configuration
    sessionStorage.setItem(STORAGE_KEYS.LAST_CONFIG, JSON.stringify(config));
    // Update timestamp
    sessionStorage.setItem(STORAGE_KEYS.CONFIG_TIMESTAMP, Date.now().toString());
  }, []);

  const loadConfig = useCallback((): ConfigData | null => {
    const config = sessionStorage.getItem(STORAGE_KEYS.LAST_CONFIG);

    if (!config) {
      return null;
    }

    // Check if expired using shared utility
    if (isSessionTimerExpired()) {
      // Clear expired data
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
