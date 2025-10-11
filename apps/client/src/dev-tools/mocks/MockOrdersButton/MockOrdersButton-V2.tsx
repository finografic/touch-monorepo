import { useOrdersOptional } from 'providers/OrdersProvider';
import { useSession } from 'providers/SessionProvider/SessionContext';
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

  const handleMockData = useCallback(() => {
    if (!ordersContext?.setOrders) return;

    // Create session and extract mock data
    const sessionId = createSession(FLOW_TYPES.PROGRAM_PRODUCT, { mode: mockFilters.mode });
    const updatedMockData = MOCK_ORDERS_DATA.map((order) => ({
      ...order,
      session: {
        id: sessionId,
        flowType: FLOW_TYPES.PROGRAM_PRODUCT,
      },
      // 🎯 ADD process data so timers will appear after submit
      process: {
        status: 'pending' as const, // Use a valid OrderStatus value
        estimatedCompletionTime: new Date(Date.now() + 60000).toISOString(),
        timeRemaining: 60,
      },
    }));

    // Assign orders to session before navigation
    const slotNumbers = updatedMockData.map((order) => order.slotNumber);
    assignOrdersToSession(sessionId, slotNumbers);

    // Set orders and navigate
    queueMicrotask(async () => {
      ordersContext.setOrders(updatedMockData);
      setPageCurrent(Object.keys(updatedMockData[0].filters || {}).length);

      requestAnimationFrame(async () => {
        navigate(PATHS.containerType);
      });

      // Update session filters after navigation
      setTimeout(async () => {
        const mockFilters = MOCK_ORDERS_DATA[0].filters;
        const sessionFilters = {
          drinkType: mockFilters.drinkType,
          drinkSubtype: mockFilters.drinkSubtype,
          drinkVolume: mockFilters.drinkVolume,
          containerType: mockFilters.containerType,
        };

        updateSessionFilters(sessionId, sessionFilters);
      }, 500);
    });
  }, [navigate, ordersContext, setPageCurrent, createSession, assignOrdersToSession, updateSessionFilters]);

  if (!ordersContext) return null;

  return (
    <button className="button" onClick={handleMockData}>
      <StarIcon />
    </button>
  );
};
