import { useRouteConfig } from 'hooks/useRouteConfig';
import { useOrders } from 'providers/OrdersProvider';
import { styles } from './DevPanel.styles';
import { useEffect, useState } from 'react';
import type { OrderItem } from 'types/orders.types';
import { useLocation } from 'react-router-dom';
import { useLayoutUi } from 'providers/LayoutUiProvider/LayoutUiContext';

export const DevPanel = () => {
  const location = useLocation();
  const routeConfig = useRouteConfig();
  const [data, setData] = useState<OrderItem[]>([]);
  const { orders } = useOrders();

  const { numSlots, fieldKey, numPads, pads } = useLayoutUi();

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
        <h2>UI: {orders.length}</h2>
        {JSON.stringify({ numSlots, fieldKey, numPads, pads }, null, 2)}
      </pre>
      <pre>
        <h2>orders: {orders.length}</h2>
        {JSON.stringify(data[0], null, 2)}
      </pre>
    </aside>
  );
};
