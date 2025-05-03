import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useOrders } from 'providers/OrdersProvider';
import { useEffect, useState } from 'react';
import type { OrderFieldKey, OrderItem } from 'types/orders.types';
import { useLoaderData, useLocation } from 'react-router-dom';
import { useLayoutUi } from 'providers/LayoutUiProvider/LayoutUiContext';
import { PADS_UI_CONFIG } from 'constants/app.config';
import type { DrinkType } from 'types/models/drink-type.model';
import { JSONTree } from './JSONTree';
import { flattenOrders, transformPadData } from 'utils/data.utils';
import { stylesLeft, stylesRight } from './DevPanel.styles';

export const DevPanel = () => {
  const location = useLocation();
  const { route, fieldKey, loaderData } = useRouteConfig();
  const [data, setData] = useState<OrderItem[]>([]);
  const { orders } = useOrders();

  const drinkTypes = useLoaderData() as DrinkType[] | undefined;
  const { numSlots, numPads, pads: padsSource } = useLayoutUi();

  const padsConfig = PADS_UI_CONFIG[fieldKey];

  // log('%c __DRINK', 'yellow', { drinkTypes });

  useEffect(() => {
    // Update UI state when drinkTypes change
    // updateFromDrinkTypes(drinkTypes);

    // Update orders data
    if (orders.length) {
      setData(orders);
    }
  }, [drinkTypes, location.pathname]);

  const ____devData = {
    route: { route, fieldKey },
    ui: {
      config: padsConfig,
      // state: { numSlots, fieldKey, numPads, pads },
    },
    orders: {
      count: orders.length,
      first: data[0],
    },
    loaderData,
  };

  const devData = {
    pads: transformPadData(padsSource),
  };

  const devOrders = flattenOrders(orders);

  const devDataRight = {
    orders: {
      count: devOrders.length,
      first: devOrders[0],
    },
  };

  return (
    <>
      <aside id="dev-data-left" css={stylesLeft}>
        <JSONTree data={devData} />
      </aside>
      <aside id="dev-data-right" css={stylesRight}>
        <JSONTree data={devDataRight} />
      </aside>
    </>
  );

  // return (
  //   <aside css={styles}>
  //     <div id="dev-data-left">
  //       <JSONTree data={devData} />
  //     </div>
  //     <div id="dev-data-right">
  //       <JSONTree data={devDataRight} />
  //     </div>
  //   </aside>
  // );

  // return (
  //   <aside css={styles}>
  //     <JSONTree data={devData} expanded={true} />
  //   </aside>
  // );
};
