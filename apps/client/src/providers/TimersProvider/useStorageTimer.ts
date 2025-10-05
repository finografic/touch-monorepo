import { useEffect, useState } from 'react';
import { getSessionTimerStatus } from 'utils/sessionTimer.utils';

/**
 * Custom hook for managing session storage timer state
 *
 * This hook provides:
 * - hasActiveTimer: boolean indicating if timer is active
 * - remainingTime: number of milliseconds remaining
 * - checkActiveTimer: function to manually check timer status
 *
 * The hook automatically checks the timer every 5 seconds and updates state accordingly.
 *
 * ✅ PERFORMANCE: This hook is standalone and doesn't affect TimerContext re-renders
 */
export const useStorageTimer = () => {
  const [hasActiveTimer, setHasActiveTimer] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const checkActiveTimer = () => {
    const status = getSessionTimerStatus();
    setHasActiveTimer(status.isActive);
    setRemainingTime(status.remaining);
  };

  useEffect(() => {
    // Initial check
    checkActiveTimer();

    // Set up interval to check every 5 seconds
    const intervalId = setInterval(checkActiveTimer, 5000);

    return () => clearInterval(intervalId);
  }, []); // Empty dependency array - no external dependencies

  return {
    hasActiveTimer,
    remainingTime,
    checkActiveTimer,
  };
};
