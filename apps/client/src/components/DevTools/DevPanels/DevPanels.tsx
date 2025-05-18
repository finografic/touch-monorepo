import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useOrders } from 'providers/OrdersProvider';
import { useLocation } from 'react-router-dom';
import { useLayoutUi } from 'providers/LayoutUiProvider/LayoutUiContext';
import { PADS_UI_CONFIG } from 'constants/ui.config';
import { JSONTree } from '../JSONTree/JSONTree';
import { transformPadData } from 'utils/data.utils';
import { stylesLeft, stylesRight } from './DevPanels.styles';
import { useFilters } from 'hooks/useFilters';

export const DevPanels = () => {
  const location = useLocation();
  const { data, dataFiltered } = useFilters();
  const { fieldKey, loaderData } = useRouteConfig();
  const { numItems, pads: padsSource } = useLayoutUi();
  const { orders } = useOrders();

  const padsConfig = PADS_UI_CONFIG[fieldKey];

  const devDataLeft = {
    pathname: location.pathname,
    fieldKey,
    config: padsConfig,
    pads: transformPadData(padsSource),
  };

  // const devOrders = {
  //   orders: flattenOrders(orders),
  // };

  const devDataRight = {
    numItems,
    count: orders.length,
    orders: {
      ...(orders?.[0] || {}),
    },
    DATA_TOTAL: data?.length,
    DATA_FILTERED: dataFiltered?.length,
    PADS_ALL: loaderData?.map((padData) => padData.name),
  };

  return (
    <>
      <aside id="dev-data-left" css={stylesLeft}>
        {/* <JSONTree data={devDataLeft} /> */}
        <pre>{JSON.stringify(devDataLeft, null, 2)}</pre>
      </aside>
      <aside id="dev-data-right" css={stylesRight}>
        <JSONTree data={devDataRight} />
      </aside>
    </>
  );
};
