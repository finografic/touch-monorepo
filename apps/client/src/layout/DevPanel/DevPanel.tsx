import { useRouteConfig } from 'hooks/useRouteConfig';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { styles } from './DevPanel.styles';

export const DevPanel = () => {
  const routeConfig = useRouteConfig();
  const { orders } = useOrders();
  const { nextRoutePathname } = usePagination();
  const routeMeta = { title: routeConfig.title, pathname: routeConfig.pathname, nextRoutePathname };

  return (
    <aside css={styles}>
      <pre>
        <h2>route</h2>
        {JSON.stringify({ ...routeMeta }, null, 2)}
      </pre>
      <pre>
        <h2>orders: {orders.length}</h2>
        {JSON.stringify(orders, null, 2)}
      </pre>
    </aside>
  );
};
