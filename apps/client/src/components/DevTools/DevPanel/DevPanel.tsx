import { useRouteConfig } from 'hooks/useRouteConfig';
import { useOrders } from 'providers/OrdersProvider';
import { styles } from './DevPanel.styles';
import { useEffect } from 'react';
import { useState } from 'react';
import type { OrderItem } from 'types/orders.types';
import { useLocation } from 'react-router-dom';
export const DevPanel = () => {
  const location = useLocation();
  const routeConfig = useRouteConfig();
  const [data, setData] = useState<OrderItem[]>([]);
  const { orders } = useOrders();

  useEffect(() => {
    if (orders.length) {
      setData(orders);
    }
  }, [location.pathname]);

  return (
    <aside css={styles}>
      <pre>
        <h2>route</h2>
        {JSON.stringify({ ...routeConfig }, null, 2)}
      </pre>
      <pre>
        <h2>orders: {orders.length}</h2>
        {JSON.stringify(data[0], null, 2)}
      </pre>
    </aside>
  );
};
