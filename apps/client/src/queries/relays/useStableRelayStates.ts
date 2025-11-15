import { useMemo, useRef } from 'react';

import type { RelayState } from './useGetRelayStates';
import { useGetRelayStates } from './useGetRelayStates';

/**
 * Wrapper hook that isolates polling behavior and only exposes data when it actually changes.
 * This prevents cascading re-renders throughout the component tree.
 *
 * The hook:
 * - Calls useGetRelayStates internally (polling continues)
 * - Only returns new data reference when isOn values actually change
 * - Maintains stable references for all other query properties
 *
 * @returns Stable relay states that only update when isOn values actually change
 */
export const useStableRelayStates = () => {
  const queryResult = useGetRelayStates();

  // Use refs to track previous values and detect actual changes
  const prevStatesRef = useRef<Map<number, boolean>>(new Map());
  const stableStatesRef = useRef<RelayState[]>([]);
  const stableIsLoadingRef = useRef<boolean>(false);

  // Only update stableStatesRef when isOn values actually change
  const stableStates = useMemo(() => {
    const currentStates = queryResult.data;

    // If no data, return previous stable reference
    if (!currentStates || currentStates.length === 0) {
      return stableStatesRef.current;
    }

    // Create a map of current isOn values
    const currentMap = new Map(currentStates.map((state) => [state.slotNumber, state.isOn]));

    // Compare with previous map to detect actual changes
    let hasChanged = false;
    if (prevStatesRef.current.size !== currentMap.size) {
      hasChanged = true;
    } else {
      for (const [slotNumber, isOn] of currentMap.entries()) {
        if (prevStatesRef.current.get(slotNumber) !== isOn) {
          hasChanged = true;
          break;
        }
      }
    }

    // Only update if values actually changed
    if (hasChanged) {
      prevStatesRef.current = currentMap;
      stableStatesRef.current = currentStates;
      return currentStates;
    }

    // Return previous stable reference to prevent re-renders
    return stableStatesRef.current;
  }, [queryResult.data]);

  // Stabilize isLoading - only update when transitioning from false->true or true->false
  // This prevents re-renders when isLoading flickers during polling
  const stableIsLoading = useMemo(() => {
    const currentIsLoading = queryResult.isLoading ?? false;
    // Only update if there's a meaningful state change
    if (stableIsLoadingRef.current !== currentIsLoading) {
      stableIsLoadingRef.current = currentIsLoading;
      return currentIsLoading;
    }
    return stableIsLoadingRef.current;
  }, [queryResult.isLoading]);

  // Return only essential properties with stable data reference
  // This prevents spreading the entire queryResult which includes many changing properties
  return {
    data: stableStates, // Stable reference - only changes when isOn values change
    isLoading: stableIsLoading, // Stabilized - only changes on meaningful state transitions
    isError: queryResult.isError, // Keep original - needed for error states
    error: queryResult.error, // Keep original - needed for error handling
    isPollingEnabled: queryResult.isPollingEnabled, // Keep original - needed for status
    enablePolling: queryResult.enablePolling, // Keep original - needed for retry
    disablePolling: queryResult.disablePolling, // Keep original - needed for control
  };
};
