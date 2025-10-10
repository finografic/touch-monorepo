/**
 * Timer Manager Service
 *
 * Modern TypeScript service for managing timer intervals.
 * Uses functional approach with const objects instead of class with 'this'.
 *
 * Features:
 * - Centralized interval management
 * - Automatic cleanup
 * - Type-safe operations
 * - No global state pollution
 */

export interface TimerCallback {
  (): void;
}

export interface TimerManagerState {
  intervals: Map<number, NodeJS.Timeout>;
  isActive: (slotNumber: number) => boolean;
  startTimer: (slotNumber: number, callback: TimerCallback, intervalMs?: number) => void;
  stopTimer: (slotNumber: number) => void;
  clearAllTimers: () => void;
  getActiveTimers: () => number[];
}

/**
 * Create a new TimerManager instance
 */
export const createTimerManager = (): TimerManagerState => {
  const intervals = new Map<number, NodeJS.Timeout>();

  const isActive = (slotNumber: number): boolean => {
    return intervals.has(slotNumber);
  };

  const startTimer = (slotNumber: number, callback: TimerCallback, intervalMs: number = 1000): void => {
    // Stop existing timer if any
    stopTimer(slotNumber);

    // Start new timer
    const intervalId = setInterval(callback, intervalMs);
    intervals.set(slotNumber, intervalId);
  };

  const stopTimer = (slotNumber: number): void => {
    const intervalId = intervals.get(slotNumber);
    if (intervalId) {
      clearInterval(intervalId);
      intervals.delete(slotNumber);
    }
  };

  const clearAllTimers = (): void => {
    intervals.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    intervals.clear();
  };

  const getActiveTimers = (): number[] => {
    return Array.from(intervals.keys());
  };

  return {
    intervals,
    isActive,
    startTimer,
    stopTimer,
    clearAllTimers,
    getActiveTimers,
  };
};

/**
 * Global timer manager instance
 * Use this singleton instance throughout the app
 */
export const timerManager = createTimerManager();
