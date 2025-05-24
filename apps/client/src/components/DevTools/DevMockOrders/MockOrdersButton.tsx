import { useOrders } from 'providers/OrdersProvider';
import { MOCK_ORDERS_DATA } from './mock-orders-C.data';
import { StarIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'routes/routes.config';

export const MockOrdersButton = () => {
  const navigate = useNavigate();
  const { setOrders } = useOrders();

  const handleMockData = () => {
    setOrders(MOCK_ORDERS_DATA);
    navigate(PATHS.initialTemperature);
  };

  return (
    <button className="btn-dev" onClick={handleMockData}>
      <StarIcon />
    </button>
  );
};
