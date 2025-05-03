import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useOrders } from 'providers/OrdersProvider';
import { styles } from './DevPanel.styles';
import { useEffect, useState } from 'react';
import type { OrderFieldKey, OrderItem } from 'types/orders.types';
import { useLoaderData, useLocation } from 'react-router-dom';
import { useLayoutUi } from 'providers/LayoutUiProvider/LayoutUiContext';
import { PADS_UI_CONFIG } from 'constants/app.config';
import type { DrinkType } from 'types/models/drink-type.model';
import JSONTree from 'components/DevTools/JSONTree/JSONTreeAlt';

export const DevPanel = () => {
  const location = useLocation();
  const routeConfig = useRouteConfig();
  const [data, setData] = useState<OrderItem[]>([]);
  const { orders } = useOrders();

  const drinkTypes = useLoaderData() as DrinkType[] | undefined;
  const { numSlots, fieldKey, numPads, pads } = useLayoutUi();

  const padsConfig = PADS_UI_CONFIG[routeConfig.fieldKey as OrderFieldKey];

  // log('%c __DRINK', 'yellow', { drinkTypes });

  useEffect(() => {
    // Update UI state when drinkTypes change
    // updateFromDrinkTypes(drinkTypes);

    // Update orders data
    if (orders.length) {
      setData(orders);
    }
  }, [drinkTypes, location.pathname]);

  const devData = {
    route: routeConfig,
    ui: {
      config: padsConfig,
      state: { numSlots, fieldKey, numPads, pads },
    },
    orders: {
      count: orders.length,
      first: data[0],
    },
  };

  return (
    <aside css={styles}>
      <JSONTree data={devData} expanded={true} />
    </aside>
  );
};
