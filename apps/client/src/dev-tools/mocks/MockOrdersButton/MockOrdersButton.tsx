import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFiltersContext } from 'providers/FiltersProvider';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useSession } from 'providers/SessionProvider/SessionContext';

import type { OrderFilters } from 'types/filters.types';
import { FLOW_TYPES } from 'types/flow.types';
import { PATHS } from 'config';
import { MOCK_ORDERS_DATA, MOCK_SELECTED_SLOTS_DATA } from './mock-orders.data';
import { ListChecksIcon, StarIcon } from 'styles/icons';

export const MockOrdersButton = () => {
  const navigate = useNavigate();
  const ordersContext = useOrders();
  const { createSession, assignOrdersToSession, updateSessionFilters } = useSession();
  const { setPageCurrent } = usePagination();
  const { setFilter } = useFiltersContext();

  const handleMockData = useCallback(() => {
    if (!ordersContext?.setOrders) return;

    // Create session and extract mock data
    const sessionId = createSession(FLOW_TYPES.PROGRAM_PRODUCT);

    // 🎯 NEW APPROACH: Use FiltersContext instead of individual order filters
    // const mockFilters = MOCK_ORDERS_DATA[0].filters;
    const mockFilters = MOCK_ORDERS_DATA as OrderFilters;

    // Assign orders to session
    const slotNumbers = MOCK_SELECTED_SLOTS_DATA.map((slot) => slot.slotNumber);
    assignOrdersToSession(sessionId, slotNumbers);

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
    // setFilter('containerType', mockFilters.containerType);

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
  ]);

  if (!ordersContext) return null;

  return (
    <button className="button" onClick={handleMockData}>
      <ListChecksIcon />
    </button>
  );
};
