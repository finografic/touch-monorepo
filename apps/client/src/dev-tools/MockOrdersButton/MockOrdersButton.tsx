import { useOrdersOptional } from 'providers/OrdersProvider';
import { MOCK_ORDERS_DATA } from './mock-orders.data';
import { StarIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'routes/routes.config';
import { useCallback } from 'react';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';

export const MockOrdersButton = () => {
  const navigate = useNavigate();
  const ordersContext = useOrdersOptional();
  const { setPageCurrent } = usePagination();

  const handleMockData = useCallback(() => {
    if (!ordersContext?.setOrders) return; // No orders context available

    // Use a microtask to ensure state is set before navigation
    queueMicrotask(() => {
      ordersContext.setOrders(MOCK_ORDERS_DATA);
      setPageCurrent(Object.keys(MOCK_ORDERS_DATA[0].filters || {}).length);
      // Use RAF to ensure state update has propagated
      requestAnimationFrame(() => {
        navigate(PATHS.temperature);
      });
    });
  }, [navigate, ordersContext, setPageCurrent]);

  // Don't render if no orders context is available
  if (!ordersContext) return null;

  return (
    <button className="btn-dev" onClick={handleMockData}>
      <StarIcon />
    </button>
  );
};
