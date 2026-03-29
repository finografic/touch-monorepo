import { useMemo, useRef } from 'react';

import type { RelayState } from 'api/endpoints';
import { useGetRelayStates } from './useGetRelayStates';

/**
 * Wraps `useGetRelayStates` and only exposes a new data reference when the
 * actual `isOn` values change. Prevents downstream re-renders caused by
 * React Query updating the query object on invalidation/refetch even when
 * relay states haven't changed.
 */
export const useStableRelayStates = () => {
  const queryResult = useGetRelayStates();

  const prevStatesRef = useRef<Map<number, boolean>>(new Map());
  const stableStatesRef = useRef<RelayState[]>([]);
  const stableIsLoadingRef = useRef<boolean>(false);

  const stableStates = useMemo(() => {
    const currentStates = queryResult.data;

    if (!currentStates || currentStates.length === 0) {
      return stableStatesRef.current;
    }

    const currentMap = new Map(currentStates.map((state) => [state.slotNumber, state.isOn]));

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

    if (hasChanged) {
      prevStatesRef.current = currentMap;
      stableStatesRef.current = currentStates;

      return currentStates;
    }

    return stableStatesRef.current;
  }, [queryResult.data]);

  const stableIsLoading = useMemo(() => {
    const currentIsLoading = queryResult.isLoading ?? false;
    if (stableIsLoadingRef.current !== currentIsLoading) {
      stableIsLoadingRef.current = currentIsLoading;

      return currentIsLoading;
    }

    return stableIsLoadingRef.current;
  }, [queryResult.isLoading]);

  return {
    data: stableStates,
    isLoading: stableIsLoading,
    isError: queryResult.isError,
    error: queryResult.error,
    refetchStates: queryResult.refetchStates,
  };
};
