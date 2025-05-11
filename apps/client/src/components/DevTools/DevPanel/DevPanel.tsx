import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useOrders } from 'providers/OrdersProvider';
import { useLocation } from 'react-router-dom';
import { useLayoutUi } from 'providers/LayoutUiProvider/LayoutUiContext';
import { PADS_UI_CONFIG } from 'constants/app.config';
import { JSONTree } from '../JSONTree/JSONTree';
import { flattenOrders, transformPadData } from 'utils/data.utils';
import { stylesLeft, stylesRight } from './DevPanel.styles';

export const DevPanel = () => {
  const location = useLocation();
  const { fieldKey } = useRouteConfig();
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
  };

  return (
    <>
      <aside id="dev-data-left" css={stylesLeft}>
        <JSONTree data={devDataLeft} />
        {/* <pre>{JSON.stringify(devDataLeft, null, 2)}</pre> */}
      </aside>
      <aside id="dev-data-right" css={stylesRight}>
        <JSONTree data={devDataRight} />
      </aside>
    </>
  );
};
