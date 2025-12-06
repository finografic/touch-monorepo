import { useEffect, useRef } from 'react';

import { useGetSlotConfigurations } from 'queries/slot-configurations';
import { useToggleRelay } from 'queries/relays';
import { useTimers } from 'providers/TimersProvider';
import { DEFROST_SLOT_NUMBER, POWER_SLOT_NUMBER } from 'admin/config/admin.slots.config';

/**
 * Hook to automatically control relays based on timer status
 *
 * When a timer starts (status: 'processing'), the associated relay turns ON
 * When a timer completes (status: 'completed'), the associated relay turns OFF
 *
 * Handles:
 * - Regular timers from timers array
 * - Defrost timer (slot 15) from defrost state
 *
 * Only controls relays that have a relayNumber assigned in slot configurations
 *
 * Fixed slots: slot #14 (power button) is excluded from timer-based control
 *              slot #15 (defrost) IS controlled by defrost timer
 */
const POWER_SLOT_ONLY = [POWER_SLOT_NUMBER] as const; // Slot controlled by power button (not timers)

export const useRelayTimerControl = () => {
  const { timers, defrost } = useTimers();
  const { data: slotConfigurations } = useGetSlotConfigurations();
  const toggleRelayMutation = useToggleRelay();

  // Track which relays are currently ON due to timers (not test buttons)
  const timerControlledRelaysRef = useRef<Set<number>>(new Set());
  // Track previous timer states to detect changes
  const prevTimerStatesRef = useRef<Map<number, 'processing' | 'completed' | 'idle'>>(new Map());
  // Track previous defrost timer state (can be processing, idle, completed, or null)
  const prevDefrostStateRef = useRef<string | null>(null);

  useEffect(() => {
    if (!slotConfigurations) return;

    // Create map: slotNumber -> relayNumber
    const slotToRelayMap = new Map<number, number | null>();
    slotConfigurations.forEach((config) => {
      if (config.relayNumber !== null) {
        slotToRelayMap.set(config.slotNumber, config.relayNumber);
      }
    });

    // Process regular timers
    if (timers) {
      timers.forEach((timer) => {
        // Skip power slot - it's controlled by power button
        if (POWER_SLOT_ONLY.includes(timer.slotNumber as any)) {
          return;
        }

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
        // Skip defrost slot - it's handled separately
        if (slotNumber === DEFROST_SLOT_NUMBER) {
          return;
        }
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
    }

    // Process defrost timer (slot 15)
    const defrostRelayNumber = slotToRelayMap.get(DEFROST_SLOT_NUMBER);
    if (defrostRelayNumber) {
      const currentDefrostStatus = defrost?.status ?? null;
      const prevDefrostStatus = prevDefrostStateRef.current;

      // Defrost timer started (processing) -> Turn relay ON
      if (currentDefrostStatus === 'processing' && prevDefrostStatus !== 'processing') {
        timerControlledRelaysRef.current.add(defrostRelayNumber);
        toggleRelayMutation.mutate({
          slotNumber: defrostRelayNumber,
          state: true,
        });
      }

      // Defrost timer stopped/completed (not processing) -> Turn relay OFF
      if (currentDefrostStatus !== 'processing' && prevDefrostStatus === 'processing') {
        timerControlledRelaysRef.current.delete(defrostRelayNumber);
        toggleRelayMutation.mutate({
          slotNumber: defrostRelayNumber,
          state: false,
        });
      }

      // Update previous defrost state
      prevDefrostStateRef.current = currentDefrostStatus;
    }
  }, [timers, defrost, slotConfigurations, toggleRelayMutation]);

  // Return function to check if a relay is controlled by a timer
  return {
    isRelayControlledByTimer: (relayNumber: number): boolean => {
      return timerControlledRelaysRef.current.has(relayNumber);
    },
  };
};
