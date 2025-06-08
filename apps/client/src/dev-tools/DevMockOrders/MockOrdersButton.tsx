import { useOrders } from 'providers/OrdersProvider';
import { MOCK_ORDERS_DATA } from './mock-orders.data';
import { StarIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'routes/routes.config';
import { useCallback } from 'react';

export const MockOrdersButton = () => {
  const navigate = useNavigate();
  const { setOrders } = useOrders();

  const handleMockData = useCallback(() => {
    // Use a microtask to ensure state is set before navigation
    queueMicrotask(() => {
      setOrders(MOCK_ORDERS_DATA);
      // Use RAF to ensure state update has propagated
      requestAnimationFrame(() => {
        navigate(PATHS.temperature);
      });
    });
  }, [navigate, setOrders]);

  return (
    <button className="btn-dev" onClick={handleMockData}>
      <StarIcon />
    </button>
  );
};
