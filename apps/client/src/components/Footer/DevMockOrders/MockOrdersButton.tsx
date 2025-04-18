import { useRouteConfig } from 'hooks/useRouteConfig';
import { useOrders } from 'providers/OrdersProvider';
import { styles } from './MockOrdersButton.styles';
import { MOCK_ORDERS_DATA } from './mock-orders.data';

export const MockOrdersButton = () => {
  // const routeConfig = useRouteConfig();
  const { setOrders } = useOrders();

  const handleMockData = () => {
    // Update processStatus for all selected orders
    // const updatedOrders = orders.map((order) => ({
    //   ...order,
    //   processStatus: order.isSelected
    //     ? {
    //         isProcessing: true,
    //         timeRemaining: 60, // Mock value: 60 seconds
    //       }
    //     : order.processStatus,
    // }));
    // setOrders(updatedOrders);
    setOrders(MOCK_ORDERS_DATA);
  };

  return (
    <button css={styles} className="btn-control" onClick={handleMockData}>
      MOCK
    </button>
  );
};
