import { useFilters } from 'providers/FiltersProvider/useFilters';
import { useLayoutUi } from 'providers/LayoutUiProvider/LayoutUiContext';
import { useOrders } from 'providers/OrdersProvider';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';

import { JSONTree } from '../components/JSONTree/JSONTree';
import { stylesRight } from './DevPanels.styles';

export const DevPanelRight = () => {
  const { data, dataFiltered } = useFilters();
  const { loaderData } = useRouteConfig();
  const { numItems } = useLayoutUi();
  const ordersContext = useOrders();
  const orders = ordersContext?.orders || [];

  /*
  // Filter out filters property from processing orders
  const cleanOrdersForDisplay = orders.map((order) => {
    if (order?.process?.status === 'processing') {
      const { filters, ...orderWithoutFilters } = order;
      return orderWithoutFilters;
    }
    return order;
  });
  */

  const devDataRight = {
    numItems,
    count: orders.length,
    // orders: cleanOrdersForDisplay,
    DATA_TOTAL: data?.length,
    DATA_FILTERED: dataFiltered?.length,
    PADS_ALL: ['', '/', '/temperature'].includes(location.pathname)
      ? []
      : loaderData?.map((padData) => padData.name),
  };

  return (
    <aside id="dev-data-right" css={stylesRight}>
      <pre id="___DATA-DUMP-ALL___">{JSON.stringify(orders)}</pre>
      {/* <pre>{JSON.stringify(cleanOrdersForDisplay)}</pre> */}
      <div className="data-tree">
        <JSONTree data={devDataRight} />
      </div>
    </aside>
  );
};
