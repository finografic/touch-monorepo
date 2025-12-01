import { useEffect, useRef } from 'react';

import { useGetSlotConfigurations } from 'queries/slot-configurations';
import { useToggleRelay } from 'queries/relays';
import { useTimers } from 'providers/TimersProvider';

/**
 * Hook to automatically control relays based on timer status
 *
 * When a timer starts (status: 'processing'), the associated relay turns ON
 * When a timer completes (status: 'completed'), the associated relay turns OFF
 *
 * Only controls relays that have a relayNumber assigned in slot configurations
 */
export const useRelayTimerControl = () => {
  const { timers } = useTimers();
  const { data: slotConfigurations } = useGetSlotConfigurations();
  const toggleRelayMutation = useToggleRelay();

  // Track which relays are currently ON due to timers (not test buttons)
  const timerControlledRelaysRef = useRef<Set<number>>(new Set());
  // Track previous timer states to detect changes
  const prevTimerStatesRef = useRef<Map<number, 'processing' | 'completed' | 'idle'>>(new Map());

  useEffect(() => {
    if (!slotConfigurations || !timers) return;

    // Create map: slotNumber -> relayNumber
    const slotToRelayMap = new Map<number, number | null>();
    slotConfigurations.forEach((config) => {
      if (config.relayNumber !== null) {
        slotToRelayMap.set(config.slotNumber, config.relayNumber);
      }
    });

    // Process each timer
    timers.forEach((timer) => {
      const relayNumber = slotToRelayMap.get(timer.slotNumber);
      if (!relayNumber) return; // Skip if no relay assigned

      const prevStatus = prevTimerStatesRef.current.get(timer.slotNumber);
      const currentStatus = timer.status;

      // Timer started (processing) -> Turn relay ON
      // Handles: new timer (prevStatus undefined) or transition from idle/completed to processing
      if (currentStatus === 'processing' && prevStatus !== 'processing') {
        timerControlledRelaysRef.current.add(relayNumber);
        // API uses relayNumber as slotNumber parameter
        toggleRelayMutation.mutate({
          slotNumber: relayNumber,
          state: true,
        });
      }

      // Timer completed -> Turn relay OFF
      // Handles: transition from processing to completed
      if (currentStatus === 'completed' && prevStatus === 'processing') {
        timerControlledRelaysRef.current.delete(relayNumber);
        // API uses relayNumber as slotNumber parameter
        toggleRelayMutation.mutate({
          slotNumber: relayNumber,
          state: false,
        });
      }

      // Update previous state (always track current state)
      prevTimerStatesRef.current.set(timer.slotNumber, currentStatus);
    });

    // Clean up: Turn OFF relays for timers that no longer exist
    const currentTimerSlotNumbers = new Set(timers.map((t) => t.slotNumber));
    prevTimerStatesRef.current.forEach((status, slotNumber) => {
      if (!currentTimerSlotNumbers.has(slotNumber)) {
        const relayNumber = slotToRelayMap.get(slotNumber);
        if (relayNumber && timerControlledRelaysRef.current.has(relayNumber)) {
          timerControlledRelaysRef.current.delete(relayNumber);
          toggleRelayMutation.mutate({
            slotNumber: relayNumber,
            state: false,
          });
        }
        prevTimerStatesRef.current.delete(slotNumber);
      }
    });
  }, [timers, slotConfigurations, toggleRelayMutation]);

  // Return function to check if a relay is controlled by a timer
  return {
    isRelayControlledByTimer: (relayNumber: number): boolean => {
      return timerControlledRelaysRef.current.has(relayNumber);
    },
  };
};

