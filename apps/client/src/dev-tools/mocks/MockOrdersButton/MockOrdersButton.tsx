import { useOrdersOptional } from 'providers/OrdersProvider';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useFilters } from 'providers/FiltersProvider';
import { MOCK_ORDERS_DATA } from './mock-orders.data';
import { StarIcon } from 'styles/icons';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'routes/routes.config';
import { useCallback } from 'react';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { FLOW_TYPES } from 'types/flow.types';
import { api } from 'api';

export const MockOrdersButton = () => {
  const navigate = useNavigate();
  const ordersContext = useOrdersOptional();
  const { createSession, assignOrdersToSession, updateSessionFilters } = useSession();
  const { ordersReadable } = useOrdersOptional();
  const { setPageCurrent } = usePagination();
  const { setFilter } = useFilters();

  const handleMockData = useCallback(() => {
    if (!ordersContext?.setOrders) return;

    // Create session and extract mock data
    const sessionId = createSession(FLOW_TYPES.PROGRAM_PRODUCT);

    // 🎯 OPTION 2: Find REAL database entry that matches mock filters
    const mockFilters = MOCK_ORDERS_DATA[0].filters;
    const realDbEntry = ordersReadable.find(
      (order) =>
        order.drinkType === mockFilters.drinkType.name &&
        order.drinkSubtype === mockFilters.drinkSubtype.name &&
        order.volume === mockFilters.drinkVolume.name &&
        order.containerType === mockFilters.containerType.name,
    );

    // �� This should ALWAYS find a match (300+ entries available)
    if (!realDbEntry) {
      // This should never happen, but if it does, it's a critical error
      console.error('🔴 CRITICAL: No matching database entry found! This should never happen!');
      throw new Error('Mock data cannot find matching database entry - check database seeding!');
    }

    // 🎯 CREATE THREE ORDERS: Use all mock orders with different slot numbers
    const updatedMockData = MOCK_ORDERS_DATA.map((mockOrder, index) => ({
      ...mockOrder,
      id: `${realDbEntry.id}_${index}`, // ← Use REAL database ID with index suffix
      session: {
        id: sessionId,
        flowType: FLOW_TYPES.PROGRAM_PRODUCT,
      },
    }));

    // Assign ALL THREE orders to session before navigation
    const slotNumbers = updatedMockData.map((order) => order.slotNumber);
    assignOrdersToSession(sessionId, slotNumbers);

    // 🎯 FIRST: Set the mode filter (like handleProgramProduct does)
    // This needs to happen BEFORE navigation to match the manual flow
    const setModeFilter = async () => {
      try {
        const response = await api.get('/modes');
        const defaultMode = response.data.find((mode: any) => mode.isDefault);

        if (defaultMode) {
          const modeFilter = {
            id: defaultMode.id,
            name: defaultMode.name,
          };
          setFilter('mode', modeFilter);
        }
      } catch (error) {
        console.error('🎯 MOCK: Error fetching modes:', error);
      }
    };

    // Set orders and navigate
    queueMicrotask(async () => {
      ordersContext.setOrders(updatedMockData);
      setPageCurrent(Object.keys(updatedMockData[0].filters || {}).length);

      // Set mode filter first
      await setModeFilter();

      requestAnimationFrame(async () => {
        navigate(PATHS.containerType);
      });

      // Update session filters after navigation
      setTimeout(async () => {
        const sessionFilters = {
          mode: mockFilters.mode, // ✅ ADD: mode filter
          drinkType: mockFilters.drinkType,
          drinkSubtype: mockFilters.drinkSubtype,
          drinkVolume: mockFilters.drinkVolume,
          containerType: mockFilters.containerType,
        };

        updateSessionFilters(sessionId, sessionFilters);

        // 🎯 CRITICAL FIX: Also set filters in OrdersContext for TemperaturePage
        ordersContext.setFilters(sessionFilters);

        // 🎯 NEW: Set filters in the new FiltersContext
        setFilter('mode', mockFilters.mode);
        setFilter('drinkType', mockFilters.drinkType);
        setFilter('drinkSubtype', mockFilters.drinkSubtype);
        setFilter('drinkVolume', mockFilters.drinkVolume);
        setFilter('containerType', mockFilters.containerType);

        console.log('🎯 MOCK: Set all filters in new FiltersContext:', {
          mode: mockFilters.mode,
          drinkType: mockFilters.drinkType,
          drinkSubtype: mockFilters.drinkSubtype,
          drinkVolume: mockFilters.drinkVolume,
          containerType: mockFilters.containerType,
        });
      }, 500);
    });
  }, [
    navigate,
    ordersContext,
    setPageCurrent,
    createSession,
    assignOrdersToSession,
    updateSessionFilters,
    ordersReadable,
    setFilter,
  ]);

  if (!ordersContext) return null;

  return (
    <button className="btn" onClick={handleMockData}>
      <StarIcon />
    </button>
  );
};
