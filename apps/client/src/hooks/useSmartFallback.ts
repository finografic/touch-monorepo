import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { useFiltersContext } from 'providers/FiltersProvider/FiltersContext';
import { useFilters } from 'providers/FiltersProvider/useFilters';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { useSession } from 'providers/SessionProvider/SessionContext';

import { generateTemperatureProfiles } from 'utils/temperature-profile-generator';
import { FLOW_TYPES } from 'types/flow.types';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import { PATHS } from 'config';

const DEBUG_FALLBACK = false; // Set to true to enable debug logs

/**
 * 🚨 SMART FALLBACK HOOK (OPTIMIZED)
 *
 * Creates context-aware fallback data that adapts to user's filter selections.
 * Uses real filters when possible, falls back to mock only when needed.
 *
 * ⚠️ ONLY FOR PRODUCT FLOW - Temperature profiles are only needed for product programming
 *
 * WHEN IT RUNS:
 * 1. ✅ On container-type page when no matching orders exist (allows user to proceed)
 * 2. ✅ On TemperaturePage when no matching orders exist (allows user to proceed)
 * 3. ❌ NEVER on early product flow pages (drink-type, volume, etc.)
 * 4. ❌ NEVER on TimePage (program-time flow doesn't need temperature profiles)
 * 5. ❌ NEVER on initial load (no session = no need for fallback)
 *
 * OPTIMIZATIONS:
 * - Route-based check: Only runs on container-type or temperature pages
 * - Flow type check: Only runs for 'program-product' sessions (skip 'program-time')
 * - Session check: Only runs when there's an active session (skip on initial load)
 * - Data check: Only creates fallback when absolutely necessary (dataFiltered is empty)
 * - Memoizes expensive temperature profile generation
 * - Uses ref to prevent duplicate setProfile calls
 * - Conditional logging to reduce console overhead
 */
export const useSmartFallback = () => {
  const location = useLocation();
  const { filters, setFilter } = useFiltersContext();
  const { setProfile } = useOrders();
  const { dataFiltered } = useFilters();
  const { currentSessionId, sessions } = useSession();

  // Track if we've already set the fallback profile to prevent duplicate calls
  const hasSetFallbackRef = useRef(false);

  // Memoize filter keys to prevent unnecessary recalculations
  const filterKeys = useMemo(
    () => ({
      modeId: filters.mode?.id || 'fallback-mode-id',
      modeName: filters.mode?.name || '3',
      drinkType: filters.drinkType?.name || 'cerveza',
      drinkSubtype: filters.drinkSubtype?.name || null,
      volume: filters.drinkVolume?.name || '50cl',
      containerType: filters.containerType?.name || 'botella',
    }),
    [
      filters.mode?.id,
      filters.mode?.name,
      filters.drinkType?.name,
      filters.drinkSubtype?.name,
      filters.drinkVolume?.name,
      filters.containerType?.name,
    ],
  );

  // 🚨 SMART FALLBACK: Create context-aware fallback entry ONLY when dataFiltered is empty
  const smartFallbackEntry = useMemo((): OrderReadableModel | null => {
    // 🎯 PERFORMANCE: Skip entirely if no active session (initial load)
    if (!currentSessionId) {
      if (DEBUG_FALLBACK) {
        console.log('%c🚨 SMART FALLBACK: No active session, skipping fallback', 'color:grey');
      }
      return null;
    }

    // 🎯 CRITICAL: Skip for 'program-time' flow (only needed for 'program-product')
    const currentSession = sessions[currentSessionId];
    if (currentSession?.flowType === FLOW_TYPES.PROGRAM_TIME) {
      if (DEBUG_FALLBACK) {
        console.log('%c🚨 SMART FALLBACK: Program Time session, skipping temperature profiles', 'color:grey');
      }
      return null;
    }

    // 🎯 ROUTE CHECK: Only run on container-type or temperature pages
    // Temperature profiles are ONLY needed at the end of the product flow
    const isOnRelevantRoute =
      location.pathname === PATHS.containerType || location.pathname === PATHS.temperature;

    if (!isOnRelevantRoute) {
      if (DEBUG_FALLBACK) {
        console.log('%c🚨 SMART FALLBACK: Not on container-type or temperature page, skipping', 'color:grey');
      }
      return null;
    }

    // Early exit: Only create fallback when there's no real data
    if (dataFiltered.length > 0) {
      if (DEBUG_FALLBACK) {
        console.log('%c🚨 SMART FALLBACK: Real data exists, no fallback needed', 'color:lime');
      }
      hasSetFallbackRef.current = false; // Reset when real data exists
      return null;
    }

    if (DEBUG_FALLBACK) {
      console.log(
        '%c🚨 SMART FALLBACK: No real data found, creating context-aware fallback entry',
        'color:orange',
      );
    }

    // Generate temperature profiles using consistent logic
    const temperatureProfiles = generateTemperatureProfiles(filterKeys.modeId, filterKeys.drinkType);

    const fallbackEntry: OrderReadableModel = {
      id: `smart-fallback-${filterKeys.modeId}-${filterKeys.drinkType}`,
      modeId: filterKeys.modeId,
      mode: filterKeys.modeName,
      drinkType: filterKeys.drinkType,
      drinkSubtype: filterKeys.drinkSubtype,
      volume: filterKeys.volume,
      containerType: filterKeys.containerType,
      temperatureProfile: 'smart-fallback-profile',
      defaultTempConsume: 4,
      defaultTempFreeze: 2,
      // ModelBaseProps
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      temperatureProfiles,
    };

    if (DEBUG_FALLBACK) {
      console.log('🚨 SMART FALLBACK: Created context-aware entry:', {
        mode: filterKeys.modeName,
        drinkType: filterKeys.drinkType,
        temperatureProfilesCount: temperatureProfiles.length,
      });
    }

    return fallbackEntry;
  }, [currentSessionId, sessions, dataFiltered.length, filterKeys, location.pathname]);

  // 🚨 SMART FALLBACK: Handle side effects (setProfile) in useEffect -- ONLY when fallback exists
  useEffect(() => {
    if (smartFallbackEntry && !hasSetFallbackRef.current) {
      if (DEBUG_FALLBACK) {
        console.warn('🚨 SMART FALLBACK: Setting smart fallback entry as profile');
      }
      setProfile(smartFallbackEntry);
      hasSetFallbackRef.current = true; // Prevent duplicate calls
    }
  }, [smartFallbackEntry, setProfile]);

  // 🚨 SMART FALLBACK: Set up temperature filter when containerType is selected
  useEffect(() => {
    // Early exit: Only run if containerType exists but temperature doesn't
    if (!filters.containerType || filters.temperature) {
      return;
    }

    // 🎯 CRITICAL: Skip for 'program-time' flow (only needed for 'program-product')
    if (currentSessionId) {
      const currentSession = sessions[currentSessionId];
      if (currentSession?.flowType === FLOW_TYPES.PROGRAM_TIME) {
        if (DEBUG_FALLBACK) {
          console.log(
            '%c🚨 SMART FALLBACK: Program Time session, skipping temperature filter setup',
            'color:grey',
          );
        }
        return;
      }
    }

    // 🎯 ROUTE CHECK: Only run on container-type or temperature pages
    const isOnRelevantRoute =
      location.pathname === PATHS.containerType || location.pathname === PATHS.temperature;

    if (!isOnRelevantRoute) {
      if (DEBUG_FALLBACK) {
        console.log(
          '%c🚨 SMART FALLBACK: Not on container-type or temperature page, skipping filter setup',
          'color:grey',
        );
      }
      return;
    }

    if (DEBUG_FALLBACK) {
      console.log('🚨 SMART FALLBACK: ContainerType selected, setting up temperature filter');
    }

    // Generate temperature profiles for the current drink type
    const temperatureProfiles = generateTemperatureProfiles(filterKeys.modeId, filterKeys.drinkType);

    // Set up temperature filter
    setFilter('temperature', {
      initial: 18,
      final: 4,
      defaultConsume: 4,
      closestInitialTemperature: 18,
      closestFinalTemperature: 4,
      temperatureProfiles,
    });
  }, [
    filters.containerType,
    filters.temperature,
    filterKeys.modeId,
    filterKeys.drinkType,
    setFilter,
    currentSessionId,
    sessions,
    location.pathname,
  ]);

  return {
    createFallbackEntry: smartFallbackEntry,
  };
};
