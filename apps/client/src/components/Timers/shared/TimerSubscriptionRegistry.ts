/**
 * Timer Subscription Registry
 *
 * Manages timer callbacks that subscribe to the global heartbeat service.
 * This ensures all timers use a single source of truth for time updates,
 * preventing multiple setInterval calls throughout the app.
 *
 * Features:
 * - Centralized callback management
 * - Subscribes to global heartbeat service (single interval)
 * - Automatic cleanup
 * - Type-safe operations
 * - No global state pollution
 */

import { heartbeatStore } from 'providers/HeartbeatProvider/heartbeat.store';

export interface TimerCallback {
  (): void;
}

export interface TimerSubscriptionRegistryState {
  callbacks: Map<number, TimerCallback>;
  isActive: (slotNumber: number) => boolean;
  register: (slotNumber: number, callback: TimerCallback) => void;
  unregister: (slotNumber: number) => void;
  clearAll: () => void;
  getActiveSlots: () => number[];
}

// Re-export for backward compatibility
export type TimerManagerState = TimerSubscriptionRegistryState;
export type TimerRegistryState = TimerSubscriptionRegistryState;

/**
 * Create a new TimerSubscriptionRegistry instance
 */
export const createTimerSubscriptionRegistry = (): TimerSubscriptionRegistryState => {
  const callbacks = new Map<number, TimerCallback>();
  let heartbeatUnsubscribe: (() => void) | null = null;

  // Subscribe to heartbeat service and call all registered callbacks
  const startHeartbeatSubscription = () => {
    if (heartbeatUnsubscribe) return; // Already subscribed

    heartbeatUnsubscribe = heartbeatStore.subscribe((state) => {
      // Call all registered callbacks when heartbeat ticks
      callbacks.forEach((callback) => {
        callback();
      });
    });
  };

  const isActive = (slotNumber: number): boolean => {
    return callbacks.has(slotNumber);
  };

  const unregister = (slotNumber: number): void => {
    callbacks.delete(slotNumber);

    // Unsubscribe from heartbeat if no more callbacks
    if (callbacks.size === 0 && heartbeatUnsubscribe) {
      heartbeatUnsubscribe();
      heartbeatUnsubscribe = null;
    }
  };

  const register = (slotNumber: number, callback: TimerCallback): void => {
    // Remove existing callback for this slot
    unregister(slotNumber);

    // Register new callback
    callbacks.set(slotNumber, callback);

    // Start heartbeat subscription if this is the first callback
    if (callbacks.size === 1) {
      startHeartbeatSubscription();
    }
  };

  const clearAll = (): void => {
    callbacks.clear();
    if (heartbeatUnsubscribe) {
      heartbeatUnsubscribe();
      heartbeatUnsubscribe = null;
    }
  };

  const getActiveSlots = (): number[] => {
    return Array.from(callbacks.keys());
  };

  return {
    callbacks,
    isActive,
    register,
    unregister,
    clearAll,
    getActiveSlots,
  };
};

/**
 * Global timer subscription registry instance
 * Use this singleton instance throughout the app
 */
export const timerSubscriptionRegistry = createTimerSubscriptionRegistry();
