import { useOrders } from 'providers/OrdersProvider';
import { styles } from './MockOrdersButton.styles';
import { MOCK_ORDERS_DATA } from './mock-orders-C.data';
import { ButtonControl } from '../../ButtonControl';

export const MockOrdersButton = () => {
  const { setOrders } = useOrders();

  const handleMockData = () => {
    setOrders(MOCK_ORDERS_DATA);
  };

  return (
    <ButtonControl css={styles} className="btn-control btn-mock" onClick={handleMockData}>
      MOCK
    </ButtonControl>
  );
};
