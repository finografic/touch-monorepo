import { useOrdersOptional } from 'providers/OrdersProvider';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useFiltersContext } from 'providers/FiltersProvider';
import { MOCK_ORDERS_DATA } from './mock-orders.data';
import { StarIcon } from 'styles/icons';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'config';
import { useCallback } from 'react';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { FLOW_TYPES } from 'types/flow.types';

export const MockOrdersButton = () => {
  const navigate = useNavigate();
  const ordersContext = useOrdersOptional();
  const { createSession, assignOrdersToSession, updateSessionFilters } = useSession();
  const { setPageCurrent } = usePagination();
  const { setFilter } = useFiltersContext();

  const handleMockData = useCallback(() => {
    if (!ordersContext?.setOrders) return;

    // Create session and extract mock data
    const sessionId = createSession(FLOW_TYPES.PROGRAM_PRODUCT);

    // 🎯 NEW APPROACH: Use FiltersContext instead of individual order filters
    const mockFilters = MOCK_ORDERS_DATA[0].filters;

    // Create orders with session assignment (no individual filters needed)
    const updatedMockData = MOCK_ORDERS_DATA.map((mockOrder, index) => ({
      ...mockOrder,
      id: `mock-order-${index + 1}`,
      session: {
        id: sessionId,
        flowType: FLOW_TYPES.PROGRAM_PRODUCT,
      },
    }));

    // Assign orders to session
    const slotNumbers = updatedMockData.map((order) => order.slotNumber);
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

    // Set orders and navigate immediately
    ordersContext.setOrders(updatedMockData);
    setPageCurrent(Object.keys(mockFilters).length);

    // Navigate to container type page (last step before temperature)
    navigate(PATHS.containerType);

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
      <StarIcon />
    </button>
  );
};
