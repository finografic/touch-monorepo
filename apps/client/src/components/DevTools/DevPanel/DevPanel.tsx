import { useRouteConfig } from 'hooks/useRouteConfig';
import { useOrders } from 'providers/OrdersProvider';
import { styles } from './DevPanel.styles';

export const DevPanel = () => {
  const routeConfig = useRouteConfig();
  const { orders } = useOrders();

  return (
    <aside css={styles}>
      <pre>
        <h2>route</h2>
        {JSON.stringify({ ...routeConfig }, null, 2)}
      </pre>
      <pre>
        <h2>orders: {orders.length}</h2>
        {JSON.stringify(orders, null, 2)}
      </pre>
    </aside>
  );
};
