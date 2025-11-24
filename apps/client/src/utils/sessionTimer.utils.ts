import { CONFIG_EXPIRY_TIME_MS, STORAGE_KEYS } from 'config/app';

/**
 * Shared utility functions for session storage timer management
 *
 * These functions are used by both useRecallConfig and useStorageTimer
 * to avoid code duplication while maintaining separation of concerns.
 */

export interface TimerStatus {
  isActive: boolean;
  remaining: number;
  elapsed: number;
}

/**
 * Check the current status of the session storage timer
 * @returns TimerStatus object with isActive, remaining, and elapsed times
 */
export const getSessionTimerStatus = (): TimerStatus => {
  const timestamp = sessionStorage.getItem(STORAGE_KEYS.CONFIG_TIMESTAMP);

  if (!timestamp) {
    return {
      isActive: false,
      remaining: 0,
      elapsed: 0,
    };
  }

  const startTime = Number.parseInt(timestamp, 10);
  const now = Date.now();
  const elapsed = now - startTime;
  const remaining = Math.max(0, CONFIG_EXPIRY_TIME_MS - elapsed);

  return {
    isActive: remaining > 0,
    remaining,
    elapsed,
  };
};

/**
 * Check if the session storage timer has expired
 * @returns boolean indicating if the timer has expired
 */
export const isSessionTimerExpired = (): boolean => {
  const status = getSessionTimerStatus();
  return !status.isActive;
};

/**
 * Clear the session storage timer
 */
export const clearSessionTimer = (): void => {
  sessionStorage.removeItem(STORAGE_KEYS.CONFIG_TIMESTAMP);
};
