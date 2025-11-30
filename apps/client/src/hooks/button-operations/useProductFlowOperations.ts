import { useCallback, useDeferredValue, useMemo, useState, useTransition } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import createCuid from '@bugsnag/cuid';

import { useRecallConfig } from 'hooks/useRecallConfig';
import { useSlotItemsConfig } from 'hooks/useSlotItemsConfig';
import { useFiltersContext } from 'providers/FiltersProvider';
import { useFilters } from 'providers/FiltersProvider/useFilters';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useTimers } from 'providers/TimersProvider';

import { FLOW_TYPES } from 'types/flow.types';
import { SlotType } from 'types/slots.types';
import { PATHS } from 'config/routes';
import { filterSlotsAvailable } from './timer-filter.utils';

/**
 * Handles Product Flow operations:
 * - Programming product (MainPage → DrinkType → ... → Temperature)
 * - Starting product process (DrinkType page)
 * - Finishing product process (Temperature page)
 * - Canceling product session
 */
export const useProductFlowOperations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const { setPageCurrent } = usePagination();
  const { orders, toggleSlot, setOrdersSession, profile } = useOrders();
  const { createSession, assignOrdersToSession, currentSessionId, clearSession, completeSession } =
    useSession();
  const { addTimer, timers } = useTimers();
  const { selectedSlots, setSelectedSlots } = useLayoutUi();
  const { setFilter, clearFilters, filters } = useFiltersContext();
  const { dataFiltered } = useFilters();
  const orderItemsConfig = useSlotItemsConfig();
  const { saveRecallConfig } = useRecallConfig();

  // Temperature control loading state
  const [isTemperatureLoading, setIsTemperatureLoading] = useState(false);
  const temperatureFilter = useDeferredValue(filters.temperature);
  const temperatureProfiles = temperatureFilter?.temperatureProfiles || [];

  // Determine which slots to process
  const slotsToProcess = useMemo(() => {
    return selectedSlots.length > 0
      ? selectedSlots.map((slot) => slot.slotNumber)
      : orders.filter((order) => order.isSelected).map((order) => order.slotNumber);
  }, [selectedSlots, orders]);

  // ========================================================================
  // TEMPERATURE CONTROL - Lazy Initialization (only runs when START is clicked)
  // ========================================================================

  /**
   * ✅ OPTIMIZED: Calculate timer durations from temperature selection
   * Only runs when user clicks START button on TemperaturePage
   * Previously called unconditionally as a hook, now lazy-initialized
   */
  const startTemperatureControl = useCallback(async () => {
    try {
      setIsTemperatureLoading(true);

      // Validate temperature filter exists
      if (!temperatureFilter?.initial || !temperatureFilter?.final) {
        throw new Error('Initial and final temperatures must be set');
      }

      if (!temperatureFilter?.closestInitialTemperature || !temperatureFilter?.closestFinalTemperature) {
        throw new Error('Closest initial and final temperatures must be calculated');
      }

      // Validate temperature profiles exist
      if (temperatureProfiles.length === 0) {
        throw new Error('Temperature profiles not available');
      }

      // Find closest temperature profiles
      const initialProfile = temperatureProfiles.find(
        (p) => p.temperature === temperatureFilter.closestInitialTemperature,
      );
      const finalProfile = temperatureProfiles.find(
        (p) => p.temperature === temperatureFilter.closestFinalTemperature,
      );

      if (!initialProfile) {
        throw new Error(
          `No temperature profile found for closestInitialTemperature ${temperatureFilter.closestInitialTemperature}°C`,
        );
      }

      if (!finalProfile) {
        throw new Error(
          `No temperature profile found for closestFinalTemperature ${temperatureFilter.closestFinalTemperature}°C`,
        );
      }

      // Calculate durations for all slot types (A, B, C)
      const slotTypeDurations = {
        [SlotType.A]: Math.abs(finalProfile.timeA - initialProfile.timeA),
        [SlotType.B]: Math.abs(finalProfile.timeB - initialProfile.timeB),
        [SlotType.C]: Math.abs(finalProfile.timeC - initialProfile.timeC),
      };

      const calculatedDurations = orders.reduce<Record<string, number>>((acc, order) => {
        acc[order.slotNumber.toString()] = slotTypeDurations[order.slotType] || 0;
        return acc;
      }, {});

      // Create timers and navigate back to MainPage
      startTransition(function updateProcessForSelectedOrders() {
        // Filter out slots that have timers with status "processing" or "completed"
        const filteredSlotsToProcess = filterSlotsAvailable(slotsToProcess, timers);

        filteredSlotsToProcess.forEach((slotNumber) => {
          const order = orders.find((o) => o.slotNumber === slotNumber);
          if (order) {
            const duration = calculatedDurations[order.slotNumber.toString()];
            const existingTimer = timers.find((t) => t.slotNumber === slotNumber);
            const orderId = existingTimer?.orderId || createCuid();

            addTimer({
              sessionId: currentSessionId!,
              slotNumber,
              orderId,
              flowType: FLOW_TYPES.PROGRAM_PRODUCT,
              duration,
              remaining: duration, // TODO: KEEPING --or-- REMOVE ??
              status: 'processing',
              completionTime: new Date(Date.now() + duration * 1000).toISOString(),
            });
          }
        });

        // Save configuration to sessionStorage so hasActiveTimer works
        // Force reset timer for Program Product flow (always overwrite/reset)
        saveRecallConfig(
          {
            filters: filters, // Save all current filters (mode, drinkType, drinkSubtype, drinkVolume, containerType, temperature with profiles)
            temperatures: {
              default: temperatureFilter?.final || 25,
              initial: temperatureFilter?.initial || 25,
              final: temperatureFilter?.final || 25,
            },
            durations: {
              default: slotTypeDurations[SlotType.B] || 300, // Default to B slot duration
              A: slotTypeDurations[SlotType.A] || 0,
              B: slotTypeDurations[SlotType.B] || 0,
              C: slotTypeDurations[SlotType.C] || 0,
            },
            selectedOrders: filteredSlotsToProcess,
          },
          true, // Force reset timer for Program Product flow
        );

        setSelectedSlots([]);

        // Mark the current session as complete when flow finishes
        if (currentSessionId) {
          completeSession(currentSessionId);
        }

        setPageCurrent(0);
        // Navigate back to main page with state indicating flow completion (not cancellation)
        navigate(PATHS.main, {
          replace: true,
          state: { flowCompleted: true, flowType: FLOW_TYPES.PROGRAM_PRODUCT },
        });
      });
    } catch (error) {
      console.error('Failed to control temperature:', error);
    } finally {
      setIsTemperatureLoading(false);
    }
  }, [
    temperatureFilter,
    temperatureProfiles,
    orders,
    slotsToProcess,
    timers,
    addTimer,
    currentSessionId,
    completeSession,
    setPageCurrent,
    navigate,
    saveRecallConfig,
    filters,
  ]);

  // ========================================================================
  // PROGRAM PRODUCT (MainPage → DrinkType page)
  // ========================================================================

  const handleProgramProduct = useCallback(() => {
    // Performance optimization: Use Maps for O(n) lookups
    const timerMap = new Map(timers.map((t) => [t.slotNumber, t]));
    const orderConfigMap = new Map(orderItemsConfig.map((config) => [config.slotNumber, config]));
    const ordersMap = new Map(orders.map((order) => [order.slotNumber, order]));

    // Get selected slots that are idle (not running timers)
    const selectedIdleSlots = selectedSlots.filter((slot) => {
      const timer = timerMap.get(slot.slotNumber);
      return !timer || (timer.status !== 'processing' && timer.status !== 'completed');
    });

    if (selectedIdleSlots.length === 0) {
      console.warn('No selected idle slots to program product for');
      return;
    }

    startTransition(() => {
      // Create orders for selected slots first and ensure they are selected
      selectedIdleSlots.forEach((slot) => {
        const orderConfig = orderConfigMap.get(slot.slotNumber);
        if (orderConfig) {
          // Check if order already exists and is selected
          const existingOrder = ordersMap.get(slot.slotNumber);
          if (!existingOrder || !existingOrder.isSelected) {
            toggleSlot({
              slotType: orderConfig.slotType,
              slotNumber: slot.slotNumber,
            });
          }
        }
      });

      // Create new session and assign selected slots
      const sessionId = createSession(FLOW_TYPES.PROGRAM_PRODUCT, { mode: filters.mode });

      assignOrdersToSession(
        sessionId,
        selectedIdleSlots.map((slot) => slot.slotNumber),
      );
      setOrdersSession({
        slotNumbers: selectedIdleSlots.map((slot) => slot.slotNumber),
        session: { id: sessionId, flowType: FLOW_TYPES.PROGRAM_PRODUCT },
      });
    });

    // Performance optimization: Get mode from localStorage instead of API call
    try {
      const storedMode = localStorage.getItem('defaultMode');
      if (storedMode) {
        const modeFilter = JSON.parse(storedMode);
        setFilter('mode', modeFilter);
      } else {
        console.warn('🔍 handleProgramProduct: No default mode found in localStorage');
      }
    } catch (error) {
      console.error('🔍 handleProgramProduct: Error parsing stored mode:', error);
    }

    // Navigate to first step of product configuration flow (drink type selection)
    const drinkTypePath = PATHS.drinkType;

    // Set pagination to first step (index 1, since index 0 is main page)
    setPageCurrent(1);
    navigate(drinkTypePath);
  }, [
    selectedSlots,
    timers,
    createSession,
    assignOrdersToSession,
    setOrdersSession,
    setPageCurrent,
    navigate,
    toggleSlot,
    orderItemsConfig,
    orders,
    setFilter,
    filters.mode,
  ]);

  // ========================================================================
  // FINISH PRODUCT PROCESS (Temperature page START button)
  // ========================================================================

  const handleStartProductProcess = useCallback(() => {
    console.log('🎯 FINISH: Starting finish product process...');
    startTemperatureControl();
  }, [startTemperatureControl]);

  // ========================================================================
  // CANCEL PRODUCT SESSION
  // ========================================================================

  const handleCancelProductSession = useCallback(() => {
    startTransition(() => {
      // Only proceed if we're on a product flow page
      const productFlowPages = [
        PATHS.drinkType,
        PATHS.drinkSubtype,
        PATHS.drinkVolume,
        PATHS.containerType,
        PATHS.temperature,
      ];

      if (!productFlowPages.includes(location.pathname as any)) {
        console.warn('handleCancelProductSession: Called but not on a product flow page');
        return;
      }

      // Remove the current session
      if (currentSessionId) {
        console.log('Cancelling product session:', currentSessionId);

        // Clear any orders that were created for this session
        const sessionOrders = orders.filter((order) => order.session?.id === currentSessionId);
        sessionOrders.forEach((order) => {
          toggleSlot({
            slotType: order.slotType,
            slotNumber: order.slotNumber,
          });
        });

        // Remove the session from SessionContext
        clearSession(currentSessionId);
        // Clear all filters from FiltersContext
        clearFilters();
      }

      // Navigate back to main page
      navigate(PATHS.main, { replace: true });
    });
  }, [location.pathname, currentSessionId, orders, toggleSlot, navigate, clearSession, clearFilters]);

  return {
    handleProgramProduct,
    handleStartProductProcess,
    handleCancelProductSession,
    isTemperatureLoading,
    isPending,
  };
};
