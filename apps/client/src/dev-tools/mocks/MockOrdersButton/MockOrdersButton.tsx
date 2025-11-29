import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSlotItemsConfig } from 'hooks/useSlotItemsConfig';
import { useGetSlotConfigurations } from 'queries/slot-configurations';
import { useFiltersContext } from 'providers/FiltersProvider';
import { useLayoutUi } from 'providers/LayoutUiProvider/LayoutUiContext';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useTimers } from 'providers/TimersProvider/TimersContext';

import type { OrderFilters } from 'types/filters.types';
import { FLOW_TYPES } from 'types/flow.types';
import { PATHS } from 'config';
import { MOCK_ORDERS_DATA } from './mock-orders.data';
import { generateSmartMockSlots } from './mock-orders.utils';
import { ListChecksIcon } from 'styles/icons';

export const MockOrdersButton = () => {
  const navigate = useNavigate();
  const ordersContext = useOrders();
  const { createSession, assignOrdersToSession, updateSessionFilters } = useSession();
  const { selectedSlots, setSelectedSlots } = useLayoutUi();
  const { setPageCurrent } = usePagination();
  const { setFilter } = useFiltersContext();
  const { toggleSlot, setOrdersSession } = useOrders();
  const orderItemsConfig = useSlotItemsConfig();
  const { data: slotConfigurations } = useGetSlotConfigurations();
  const { timers } = useTimers();

  const handleMockData = useCallback(() => {
    if (!ordersContext?.setOrders) return;

    // Create session and extract mock data
    const sessionId = createSession(FLOW_TYPES.PROGRAM_PRODUCT);

    // 🎯 NEW APPROACH: Use FiltersContext instead of individual order filters
    // const mockFilters = MOCK_ORDERS_DATA[0].filters;
    const mockFilters = MOCK_ORDERS_DATA as OrderFilters;

    // ======================================================================== //
    // SMART RANDOM ASSIGNMENT LOGIC

    // Get slots with active timers (blocked from assignment)
    const slotsTimers = timers.map((timer) => timer.slotNumber);

    // Get only active slot numbers from slot configurations
    const activeSlotNumbers =
      slotConfigurations?.filter((config) => config.isActive).map((config) => config.slotNumber) || [];

    // Generate smart mock slots that:
    // - Exclude slots with timers
    // - Exclude slots that are not active (isActive: false)
    // - Prioritize user-selected slots
    // - Try to match slotType when possible
    const mockSlots = generateSmartMockSlots(orderItemsConfig, slotsTimers, selectedSlots, activeSlotNumbers);

    // Extract slot numbers for session assignment
    const slotNumbers = mockSlots.map((slot) => slot.slotNumber);

    // Ensure orders are created and selected for the mock slots
    mockSlots.forEach((slot) => {
      const orderConfig = orderItemsConfig.find((config) => config.slotNumber === slot.slotNumber);
      if (orderConfig) {
        toggleSlot({
          slotType: orderConfig.slotType,
          slotNumber: slot.slotNumber,
        });
      }
    });

    // Set selected slots in LayoutUi context
    setSelectedSlots(mockSlots);

    // Assign slotNumbers to session
    assignOrdersToSession(sessionId, slotNumbers);

    // Link orders to session (this is critical for persistence)
    setOrdersSession({
      slotNumbers,
      session: { id: sessionId, flowType: FLOW_TYPES.PROGRAM_PRODUCT },
    });

    // 🚀 PERFORMANCE OPTIMIZATION: Get mode from localStorage instead of API call
    try {
      const storedMode = localStorage.getItem('defaultMode');
      if (storedMode) {
        const modeFilter = JSON.parse(storedMode);
        setFilter('mode', modeFilter);
      } else {
        console.warn('🔍 MOCK: No default mode found in localStorage');
      }
    } catch (error) {
      console.error('🔍 MOCK: Error parsing stored mode:', error);
    }

    setPageCurrent(Object.keys(mockFilters).length);

    // // Navigate to container type page (last step before temperature)
    // navigate(PATHS.containerType);

    // Set all filters in FiltersContext (modern approach)
    setFilter('mode', mockFilters.mode);
    setFilter('drinkType', mockFilters.drinkType);
    setFilter('drinkSubtype', mockFilters.drinkSubtype);
    setFilter('drinkVolume', mockFilters.drinkVolume);
    setFilter('containerType', mockFilters.containerType);

    // Also update session filters for backward compatibility
    const sessionFilters = {
      mode: mockFilters.mode,
      drinkType: mockFilters.drinkType,
      drinkSubtype: mockFilters.drinkSubtype,
      drinkVolume: mockFilters.drinkVolume,
      containerType: mockFilters.containerType,
    };
    updateSessionFilters(sessionId, sessionFilters);

    // Navigate to container type page (last step before temperature)
    navigate(PATHS.containerType);

    console.log('🎯 MOCK: Set all filters in FiltersContext:', sessionFilters);
  }, [
    navigate,
    ordersContext,
    setPageCurrent,
    createSession,
    assignOrdersToSession,
    updateSessionFilters,
    setFilter,
    setSelectedSlots,
    toggleSlot,
    setOrdersSession,
    orderItemsConfig,
    slotConfigurations,
    timers,
    selectedSlots,
  ]);

  if (!ordersContext) return null;

  return (
    <button className="button" onClick={handleMockData}>
      <ListChecksIcon />
    </button>
  );
};
