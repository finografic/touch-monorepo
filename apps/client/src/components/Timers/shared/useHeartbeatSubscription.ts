import { useEffect, useState } from 'react';

import { heartbeatStore } from 'providers/HeartbeatProvider/heartbeat.store';

/**
 * Hook to subscribe to the global heartbeat store
 *
 * This ensures all timers use a single source of truth for time updates,
 * preventing multiple setInterval calls throughout the app.
 *
 * @returns Current timestamp from heartbeat store
 */
export const useHeartbeatSubscription = (): number => {
  const [now, setNow] = useState(() => heartbeatStore.getState().now);

  useEffect(() => {
    // Subscribe to heartbeat store updates
    const unsubscribe = heartbeatStore.subscribe((state) => {
      setNow(state.now);
    });

    // Initial sync
    setNow(heartbeatStore.getState().now);

    return unsubscribe;
  }, []);

  return now;
};
