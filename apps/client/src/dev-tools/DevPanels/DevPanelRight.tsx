import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useOrders } from 'providers/OrdersProvider';
import { useLayoutUi } from 'providers/LayoutUiProvider/LayoutUiContext';
import { JSONTree } from '../JSONTree/JSONTree';
import { stylesRight } from './DevPanels.styles';
import { useFilters } from 'hooks/useFilters';

export const DevPanelRight = () => {
  const { data, dataFiltered } = useFilters();
  const { loaderData } = useRouteConfig();
  const { numItems } = useLayoutUi();
  const { orders } = useOrders();

  // Filter out filters property from processing orders
  const cleanOrdersForDisplay = orders.map((order) => {
    // if (order.process?.status === 'processing') {
    //   const { filters, ...orderWithoutFilters } = order;
    //   return orderWithoutFilters;
    // }
    return order;
  });

  const devDataRight = {
    numItems,
    count: orders.length,
    orders: cleanOrdersForDisplay,
    DATA_TOTAL: data?.length,
    DATA_FILTERED: dataFiltered?.length,
    PADS_ALL: loaderData?.map((padData) => padData.name),
  };

  return (
    <aside id="dev-data-right" css={stylesRight}>
      <pre>{JSON.stringify(cleanOrdersForDisplay)}</pre>
      <div className="data-tree">
        <JSONTree data={devDataRight} />
      </div>
    </aside>
  );
};
