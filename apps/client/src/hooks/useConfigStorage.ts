import { useCallback } from 'react';
import { CONFIG_EXPIRY_TIME_MS, STORAGE_KEYS } from 'constants/app.config';

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
    const timestamp = sessionStorage.getItem(STORAGE_KEYS.CONFIG_TIMESTAMP);
    const config = sessionStorage.getItem(STORAGE_KEYS.LAST_CONFIG);

    if (!timestamp || !config) {
      return null;
    }

    // Check if expired
    const startTime = Number.parseInt(timestamp, 10);
    const now = Date.now();
    const elapsed = now - startTime;

    if (elapsed > CONFIG_EXPIRY_TIME_MS) {
      // Clear expired data
      sessionStorage.removeItem(STORAGE_KEYS.LAST_CONFIG);
      sessionStorage.removeItem(STORAGE_KEYS.CONFIG_TIMESTAMP);
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
    sessionStorage.removeItem(STORAGE_KEYS.CONFIG_TIMESTAMP);
  }, []);

  return {
    saveConfig,
    loadConfig,
    clearConfig,
  };
};
